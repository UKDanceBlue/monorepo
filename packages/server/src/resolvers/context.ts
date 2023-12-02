import type { ContextFunction } from "@apollo/server";
import type { KoaContextFunctionArgument } from "@as-integrations/koa";
import { AuthSource, type AuthorizationContext } from "@ukdanceblue/common";
import type { DefaultContext, DefaultState } from "koa";

import { defaultAuthorization, parseUserJwt } from "../lib/auth/index.js";
import { logDebug } from "../logger.js";
import { PersonModel } from "../models/Person.js";

export interface GraphQLContext extends DefaultContext, AuthorizationContext {
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
      authorization: defaultAuthorization,
      contextErrors: [],
      authSource: AuthSource.None,
    };
  }
  const { userId, auth, authSource } = parseUserJwt(token);
  if (!userId) {
    logDebug("graphqlContextFunction No userId found");
    return {
      authenticatedUser: null,
      authorization: auth,
      contextErrors: [],
      authSource,
    };
  }

  const person = await PersonModel.findByUuid(userId);
  if (person) {
    const personResource = person.toResource();
    logDebug("graphqlContextFunction Found user", personResource);
    return {
      authenticatedUser: personResource,
      authorization: personResource.role.toAuthorization(),
      contextErrors: [],
      authSource,
    };
  } else {
    logDebug("graphqlContextFunction User not found");
    return {
      authenticatedUser: null,
      authorization: defaultAuthorization,
      contextErrors: ["User not found"],
      authSource,
    };
  }
};
