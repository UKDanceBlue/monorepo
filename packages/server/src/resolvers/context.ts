import type { ContextFunction } from "@apollo/server";
import type { KoaContextFunctionArgument } from "@as-integrations/koa";
import type { AuthorizationContext } from "@ukdanceblue/common";
import {
  AuthSource,
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

export const graphqlContextFunction: ContextFunction<
  [KoaContextFunctionArgument<DefaultState, GraphQLContext>],
  GraphQLContext
> = async ({ ctx }): Promise<GraphQLContext> => {
  // Set up the context object
  const context: GraphQLContext = {
    authenticatedUser: null,
    effectiveCommitteeRoles: [],
    teamMemberships: [],
    userData: {
      authSource: AuthSource.None,
    },
    authorization: defaultAuthorization,
    contextErrors: [],
  };

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
    return context;
  }

  // Parse the token
  const { userId, authSource } = parseUserJwt(token);
  // Set the auth source
  context.userData.authSource = authSource;

  // Set the dbRole based on the auth source
  if (authSource === AuthSource.LinkBlue || authSource === AuthSource.Demo) {
    context.authorization.dbRole = DbRole.UKY;
  } else if (authSource === AuthSource.Anonymous) {
    context.authorization.dbRole = DbRole.Public;
  }

  // If we have a user ID, look up the user
  if (userId) {
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
      context.authenticatedUser = personResource;

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
      context.authorization.committees = committees;

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
      context.teamMemberships = teamMemberships.map((membership) => ({
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
      context.effectiveCommitteeRoles = effectiveCommitteeRoles;

      // If the user is on a committee, override the dbRole
      if (effectiveCommitteeRoles.length > 0) {
        context.authorization.dbRole = DbRole.Committee;
      }
    }
  }

  context.authorization.accessLevel = roleToAccessLevel(context.authorization);

  logger.trace("graphqlContextFunction Context", context);

  return context;
};
