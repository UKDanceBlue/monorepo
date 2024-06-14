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
} from "@ukdanceblue/common";
import type { DefaultState } from "koa";
import { Container } from "typedi";

import { defaultAuthorization, parseUserJwt } from "../lib/auth/index.js";
import { logger } from "../lib/logging/logger.js";
import { PersonRepository } from "../repositories/person/PersonRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";

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
): Promise<GraphQLContext> {
  const outputContext = structuredClone(inputContext);
  const personRepository = Container.get(PersonRepository);
  const person = await personRepository.findPersonAndTeamsByUnique({
    uuid: userId,
  });

  // If we found a user, set the authenticated user
  if (person) {
    // Convert the user to a resource and set it on the context
    const personResource = await personModelToResource(
      person,
      personRepository
    );
    logger.trace("graphqlContextFunction Found user", personResource);
    outputContext.authenticatedUser = personResource;
    outputContext.userData.userId = userId;

    // Set the committees the user is on
    const committeeMemberships =
      await personRepository.findCommitteeMembershipsOfPerson({
        id: person.id,
      });
    const committees =
      committeeMemberships
        ?.map((membership) =>
          membership.team.correspondingCommittee
            ? {
                identifier: membership.team.correspondingCommittee.identifier,
                role: membership.committeeRole ?? CommitteeRole.Member,
              }
            : undefined
        )
        .filter(
          (committee): committee is NonNullable<typeof committee> =>
            committee != null
        ) ?? [];
    logger.trace("graphqlContextFunction Found committees", ...committees);
    outputContext.authorization.committees = committees;

    // Set the teams the user is on
    const teamMemberships =
      (await personRepository.findMembershipsOfPerson(
        {
          id: person.id,
        },
        {},
        undefined,
        true
      )) ?? [];
    logger.trace(
      "graphqlContextFunction Found team memberships",
      ...teamMemberships
    );
    outputContext.teamMemberships = teamMemberships.map((membership) => ({
      teamType: membership.team.type,
      position: membership.position,
      teamId: membership.team.uuid,
    }));

    // Set the effective committee roles the user has
    const effectiveCommitteeRoles =
      await personRepository.getEffectiveCommitteeRolesOfPerson({
        id: person.id,
      });
    logger.trace(
      "graphqlContextFunction Effective committee roles",
      ...effectiveCommitteeRoles
    );
    outputContext.authorization.committees = effectiveCommitteeRoles;

    // If the user is on a committee, override the dbRole
    if (effectiveCommitteeRoles.length > 0) {
      outputContext.authorization.dbRole = DbRole.Committee;
    }
  }

  return outputContext;
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
  let superAdmin = isSuperAdmin(contextWithUser.authorization.committees);
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
    superAdmin = false;
  }

  const finalContext: GraphQLContext = {
    ...contextWithUser,
    authorization: {
      ...contextWithUser.authorization,
      accessLevel: superAdmin
        ? AccessLevel.SuperAdmin
        : roleToAccessLevel(contextWithUser.authorization),
    },
  };

  logger.trace("graphqlContextFunction Context", finalContext);

  return finalContext;
};
