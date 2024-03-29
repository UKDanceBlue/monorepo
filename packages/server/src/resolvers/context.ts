import type { ContextFunction } from "@apollo/server";
import type { KoaContextFunctionArgument } from "@as-integrations/koa";
import type { AuthorizationContext } from "@ukdanceblue/common";
import { AuthSource, MembershipPositionType } from "@ukdanceblue/common";
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
      userData: {
        auth: defaultAuthorization,
        authSource: AuthSource.None,
      },
      contextErrors: [],
    };
  }
  const { userId, auth, authSource } = parseUserJwt(token);
  if (!userId) {
    logger.trace("graphqlContextFunction No userId found");
    return {
      authenticatedUser: null,
      userData: {
        auth,
        authSource,
      },
      contextErrors: [],
    };
  }

  const personRepository = Container.get(PersonRepository);
  const person = await personRepository.findPersonAndTeamsByUnique({
    uuid: userId,
  });

  if (person) {
    const personResource = personModelToResource(person);

    logger.trace("graphqlContextFunction Found user", personResource);
    return {
      authenticatedUser: personResource,
      userData: {
        auth: personResource.role.toAuthorization(),
        userId,
        teamIds: person.memberships.map((m) => m.team.uuid),
        captainOfTeamIds: person.memberships
          .filter((m) => m.position === MembershipPositionType.Captain)
          .map((m) => m.team.uuid),
        authSource,
      },
      contextErrors: [],
    };
  } else {
    logger.trace("graphqlContextFunction User not found");
    return {
      authenticatedUser: null,
      userData: {
        auth: defaultAuthorization,
        authSource: AuthSource.None,
      },
      contextErrors: ["User not found"],
    };
  }
};
