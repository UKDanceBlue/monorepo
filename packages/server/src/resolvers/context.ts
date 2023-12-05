import type { ContextFunction } from "@apollo/server";
import type { KoaContextFunctionArgument } from "@as-integrations/koa";
import type { AuthorizationContext } from "@ukdanceblue/common";
import { AuthSource, MembershipPositionType } from "@ukdanceblue/common";
import type { DefaultState } from "koa";

import { defaultAuthorization, parseUserJwt } from "../lib/auth/index.js";
import { logDebug } from "../logger.js";
import { MembershipModel } from "../models/Membership.js";
import { PersonModel } from "../models/Person.js";

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
    logDebug("graphqlContextFunction No userId found");
    return {
      authenticatedUser: null,
      userData: {
        auth,
        authSource,
      },
      contextErrors: [],
    };
  }

  const person = await PersonModel.findByUuid(userId, {
    include: [MembershipModel.withScope("withTeam")],
  });
  if (person) {
    const personResource = await person.toResource();
    logDebug("graphqlContextFunction Found user", personResource);
    return {
      authenticatedUser: personResource,
      userData: {
        auth: personResource.role.toAuthorization(),
        userId,
        teamIds: person.memberships.map((m) => {
          if (!m.team) {
            throw new Error("Membership has no team");
          }
          return m.team.uuid;
        }),
        captainOfTeamIds: person.memberships
          .filter((m) => m.position === MembershipPositionType.Captain)
          .map((m) => {
            if (!m.team) {
              throw new Error("Membership has no team");
            }
            return m.team.uuid;
          }),
        authSource,
      },
      contextErrors: [],
    };
  } else {
    logDebug("graphqlContextFunction User not found");
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
