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
  let token = ctx.cookies.get("token");
  if (!token) {
    const authorizationHeader = ctx.get("Authorization");
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      token = authorizationHeader.substring("Bearer ".length);
    }
  }
  if (!token) {
    return {
      authenticatedUser: null,
      effectiveCommitteeRoles: [],
      teamMemberships: [],
      userData: {
        authSource: AuthSource.None,
      },
      authorization: defaultAuthorization,
      contextErrors: [],
    };
  }
  const { userId, authSource } = parseUserJwt(token);
  if (!userId) {
    logger.trace("graphqlContextFunction No userId found");
    return {
      authenticatedUser: null,
      effectiveCommitteeRoles: [],
      teamMemberships: [],
      userData: {
        authSource,
      },
      authorization: defaultAuthorization,
      contextErrors: [],
    };
  }

  const personRepository = Container.get(PersonRepository);
  const person = await personRepository.findPersonAndTeamsByUnique({
    uuid: userId,
  });

  if (person) {
    const personResource = await personModelToResource(
      person,
      personRepository
    );
    logger.trace("graphqlContextFunction Found user", personResource);

    const memberships = await personRepository.findCommitteeMembershipsOfPerson(
      { id: person.id }
    );
    const committees =
      memberships
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
    logger.trace("graphqlContextFunction Found committees", committees);

    const teamMemberships = await personRepository.findMembershipsOfPerson({
      id: person.id,
    });
    logger.trace(
      "graphqlContextFunction Found team memberships",
      teamMemberships
    );

    const effectiveCommitteeRoles =
      await personRepository.getEffectiveCommitteeRolesOfPerson({
        id: person.id,
      });
    logger.trace(
      "graphqlContextFunction Effective committee roles",
      effectiveCommitteeRoles
    );

    let dbRole: DbRole;
    if (effectiveCommitteeRoles.length > 0) {
      dbRole = DbRole.Committee;
    } else if (
      authSource === AuthSource.LinkBlue ||
      authSource === AuthSource.Demo
    ) {
      dbRole = DbRole.UKY;
    } else if (authSource === AuthSource.Anonymous) {
      dbRole = DbRole.Public;
    } else {
      dbRole = DbRole.None;
    }
    return {
      authenticatedUser: personResource,
      effectiveCommitteeRoles,
      teamMemberships:
        teamMemberships?.map((membership) => ({
          teamType: membership.team.type,
          position: membership.position,
          teamId: membership.team.uuid,
        })) ?? [],
      userData: {
        userId,
        authSource,
      },
      authorization: {
        committees,
        dbRole,
        accessLevel: roleToAccessLevel({ dbRole, committees }),
      },
      contextErrors: [],
    };
  } else {
    logger.trace("graphqlContextFunction User not found");
    return {
      authenticatedUser: null,
      effectiveCommitteeRoles: [],
      teamMemberships: [],
      userData: {
        authSource: AuthSource.None,
      },
      authorization: defaultAuthorization,
      contextErrors: ["User not found"],
    };
  }
};
