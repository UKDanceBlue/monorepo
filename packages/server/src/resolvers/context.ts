import { defaultAuthorization, parseUserJwt } from "#auth/index.js";
import { logger } from "#logging/logger.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";

import {
  AccessLevel,
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  parseGlobalId,
  roleToAccessLevel,
  TeamType,
} from "@ukdanceblue/common";
import { ErrorCode } from "@ukdanceblue/common/error";
import { Ok } from "ts-results-es";
import { Container } from "@freshgum/typedi";

import type { ContextFunction } from "@apollo/server";
import type { KoaContextFunctionArgument } from "@as-integrations/koa";
import type {
  AuthorizationContext,
  EffectiveCommitteeRole,
} from "@ukdanceblue/common";
import type { ConcreteResult } from "@ukdanceblue/common/error";
import type { DefaultState } from "koa";
import { superAdminLinkblues } from "#environment";

export interface GraphQLContext extends AuthorizationContext {}

function isSuperAdmin(
  committeeRoles: EffectiveCommitteeRole[],
  linkblue?: string | null | undefined
): boolean {
  return (
    (typeof superAdminLinkblues !== "symbol" &&
      linkblue &&
      superAdminLinkblues.includes(linkblue)) ||
    committeeRoles.some(
      (role) =>
        // TODO: replace "=== Coordinator" with a check for just app&web, but that requires information about what kind of coordinator someone is
        role.identifier === CommitteeIdentifier.techCommittee &&
        role.role === CommitteeRole.Chair
    )
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
    if (person.error.tag === ErrorCode.NotFound) {
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
    if (teamMemberships.error.tag === ErrorCode.NotFound) {
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
  outputContext.authorization.effectiveCommitteeRoles =
    effectiveCommitteeRoles.value;

  // If the user is on a committee, override the dbRole
  if (effectiveCommitteeRoles.value.length > 0) {
    outputContext.authorization.dbRole = DbRole.Committee;
  }

  return Ok(outputContext);
}

const defaultContext: Readonly<GraphQLContext> = Object.freeze<GraphQLContext>({
  authenticatedUser: null,
  teamMemberships: [],
  userData: {
    authSource: AuthSource.None,
  },
  authorization: defaultAuthorization,
});

const anonymousContext: Readonly<GraphQLContext> =
  Object.freeze<GraphQLContext>({
    ...defaultContext,
    authorization: {
      accessLevel: AccessLevel.Public,
      effectiveCommitteeRoles: [],
      dbRole: DbRole.Public,
    },
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

  if (authSource === AuthSource.Anonymous) {
    return anonymousContext;
  }

  // Set the dbRole based on the auth source
  let authSourceDbRole: DbRole;
  if (authSource === AuthSource.LinkBlue || authSource === AuthSource.Demo) {
    authSourceDbRole = DbRole.UKY;
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
  let superAdmin = isSuperAdmin(
    contextWithUser.value.authorization.effectiveCommitteeRoles,
    contextWithUser.value.authenticatedUser?.linkblue
  );
  if (
    superAdmin &&
    ctx.request.headers["x-ukdb-masquerade"] &&
    typeof ctx.request.headers["x-ukdb-masquerade"] === "string"
  ) {
    const parsedId = parseGlobalId(ctx.request.headers["x-ukdb-masquerade"]);
    if (parsedId.isErr()) {
      logger.error(
        "graphqlContextFunction Error parsing masquerade ID",
        parsedId.error
      );
      return structuredClone(defaultContext);
    }
    logger.trace("graphqlContextFunction Masquerading as", parsedId.value.id);
    // We need to reset the dbRole to the default one in case the masquerade user is not a committee member
    contextWithUser = await withUserInfo(
      {
        ...defaultContext,
        authorization: {
          ...defaultContext.authorization,
          dbRole: authSourceDbRole,
        },
      },
      parsedId.value.id
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

  if (
    superAdmin &&
    !contextWithUser.value.authorization.effectiveCommitteeRoles.some(
      (role) => role.identifier === CommitteeIdentifier.techCommittee
    )
  ) {
    contextWithUser.value.authorization.effectiveCommitteeRoles.push({
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Chair,
    });
    contextWithUser.value.authorization.dbRole = DbRole.Committee;
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
