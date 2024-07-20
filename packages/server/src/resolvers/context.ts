import type { ContextFunction } from "@apollo/server";
import type { KoaContextFunctionArgument } from "@as-integrations/koa";
import type {
  AuthorizationContext,
  EffectiveCommitteeRole,
} from "@ukdanceblue/common";
import {
  AccessLevel,
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  roleToAccessLevel,
  TeamType,
} from "@ukdanceblue/common";
import { NotFoundError } from "@ukdanceblue/common/error";
import type { ConcreteResult } from "@ukdanceblue/common/error";
import type { DefaultState } from "koa";
import { Ok } from "ts-results-es";
import { Container } from "typedi";

import { defaultAuthorization, parseUserJwt } from "#auth/index.js";
import { logger } from "#logging/logger.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";

export interface GraphQLContext extends AuthorizationContext {
  contextErrors: string[];
}

function isSuperAdmin(committeeRoles: EffectiveCommitteeRole[]): boolean {
  return committeeRoles.some(
    (role) =>
      // TODO: replace "=== Coordinator" with a check for just app&web, but that requires information about what kind of coordinator someone is
      role.identifier === CommitteeIdentifier.techCommittee &&
      (role.role === CommitteeRole.Chair ||
        role.role === CommitteeRole.Coordinator)
  );
}

async function withUserInfo(
  inputContext: GraphQLContext,
  userId: string
): Promise<ConcreteResult<GraphQLContext>> {
  const outputContext = structuredClone(inputContext);
  const personRepository = Container.get(PersonRepository);
  const person = await personRepository.findPersonAndTeamsByUnique({
    uuid: userId,
  });

  if (person.isErr()) {
    if (person.error.tag === NotFoundError.Tag) {
      // Short-circuit if the user is not found
      return Ok(outputContext);
    }
    return person;
  }

  // If we found a user, set the authenticated user
  // Convert the user to a resource and set it on the context
  const personResource = await personModelToResource(
    person.value,
    personRepository
  ).promise;
  if (personResource.isErr()) {
    return personResource;
  }
  logger.trace("graphqlContextFunction Found user", personResource.value);
  outputContext.authenticatedUser = personResource.value;
  outputContext.userData.userId = userId;

  // Set the committees the user is on
  const committeeRoles =
    await personRepository.getEffectiveCommitteeRolesOfPerson({
      id: person.value.id,
    });
  if (committeeRoles.isErr()) {
    return committeeRoles;
  }
  logger.trace(
    "graphqlContextFunction Found committees",
    ...committeeRoles.value
  );
  outputContext.authorization.committees = committeeRoles.value;

  // Set the teams the user is on
  let teamMemberships = await personRepository.findMembershipsOfPerson(
    {
      id: person.value.id,
    },
    {},
    undefined,
    true
  );
  if (teamMemberships.isErr()) {
    if (teamMemberships.error.tag === NotFoundError.Tag) {
      teamMemberships = Ok([]);
    } else {
      return teamMemberships;
    }
  }
  logger.trace(
    "graphqlContextFunction Found team memberships",
    ...teamMemberships.value
  );
  outputContext.teamMemberships = teamMemberships.value.map((membership) => ({
    teamType:
      membership.team.type === "Committee"
        ? TeamType.Spirit
        : membership.team.type,
    position: membership.position,
    teamId: membership.team.uuid,
  }));

  // Set the effective committee roles the user has
  const effectiveCommitteeRoles =
    await personRepository.getEffectiveCommitteeRolesOfPerson({
      id: person.value.id,
    });
  if (effectiveCommitteeRoles.isErr()) {
    return effectiveCommitteeRoles;
  }
  logger.trace(
    "graphqlContextFunction Effective committee roles",
    ...effectiveCommitteeRoles.value
  );
  outputContext.authorization.committees = effectiveCommitteeRoles.value;

  // If the user is on a committee, override the dbRole
  if (effectiveCommitteeRoles.value.length > 0) {
    outputContext.authorization.dbRole = DbRole.Committee;
  }

  return Ok(outputContext);
}

const defaultContext: Readonly<GraphQLContext> = Object.freeze({
  authenticatedUser: null,
  teamMemberships: [],
  userData: {
    authSource: AuthSource.None,
  },
  authorization: defaultAuthorization,
  contextErrors: [],
});

export const graphqlContextFunction: ContextFunction<
  [KoaContextFunctionArgument<DefaultState, GraphQLContext>],
  GraphQLContext
> = async ({ ctx }): Promise<GraphQLContext> => {
  // Get the token from the cookies or the Authorization header
  let token = ctx.cookies.get("token");
  if (!token) {
    const authorizationHeader = ctx.get("Authorization");
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      token = authorizationHeader.substring("Bearer ".length);
    }
  }
  if (!token) {
    // Short-circuit if no token is present
    return defaultContext;
  }

  // Parse the token
  const { userId, authSource } = parseUserJwt(token);

  // Set the dbRole based on the auth source
  let authSourceDbRole: DbRole;
  if (authSource === AuthSource.LinkBlue || authSource === AuthSource.Demo) {
    authSourceDbRole = DbRole.UKY;
  } else if (authSource === AuthSource.Anonymous) {
    authSourceDbRole = DbRole.Public;
  } else {
    authSourceDbRole = DbRole.None;
  }

  if (!userId) {
    logger.trace("graphqlContextFunction No user ID");
    return structuredClone(defaultContext);
  }

  // If we have a user ID, look up the user
  let contextWithUser = await withUserInfo(
    {
      ...defaultContext,
      authorization: {
        ...defaultContext.authorization,
        dbRole: authSourceDbRole,
      },
    },
    userId
  );
  if (contextWithUser.isErr()) {
    logger.error(
      "graphqlContextFunction Error looking up user",
      contextWithUser.error
    );
    return structuredClone(defaultContext);
  }
  let superAdmin = isSuperAdmin(contextWithUser.value.authorization.committees);
  if (
    superAdmin &&
    ctx.request.headers["x-ukdb-masquerade"] &&
    typeof ctx.request.headers["x-ukdb-masquerade"] === "string"
  ) {
    // We need to reset the dbRole to the default one in case the masquerade user is not a committee member
    contextWithUser = await withUserInfo(
      {
        ...defaultContext,
        authorization: {
          ...defaultContext.authorization,
          dbRole: authSourceDbRole,
        },
      },
      ctx.request.headers["x-ukdb-masquerade"]
    );
    if (contextWithUser.isErr()) {
      logger.error(
        "graphqlContextFunction Error looking up user",
        contextWithUser.error
      );
      return structuredClone(defaultContext);
    }
    superAdmin = false;
  }

  const finalContext: GraphQLContext = {
    ...contextWithUser.value,
    authorization: {
      ...contextWithUser.value.authorization,
      accessLevel: superAdmin
        ? AccessLevel.SuperAdmin
        : roleToAccessLevel(contextWithUser.value.authorization),
    },
  };

  logger.trace("graphqlContextFunction Context", finalContext);

  return finalContext;
};
