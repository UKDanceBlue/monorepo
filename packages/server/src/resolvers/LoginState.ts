import { Service } from "@freshgum/typedi";
import { DbRole } from "@ukdanceblue/common";
import { LoginState } from "@ukdanceblue/common";
import { Ctx, Query, Resolver } from "type-graphql";

import * as Context from "@/resolvers/context.js";

@Resolver(() => LoginState)
@Service([])
export class LoginStateResolver {
  @Query(() => LoginState)
  loginState(@Ctx() ctx: Context.GraphQLContext): LoginState {
    return {
      loggedIn: ctx.authorization.dbRole !== DbRole.None,
      effectiveCommitteeRoles: ctx.authorization.effectiveCommitteeRoles,
      accessLevel: ctx.authorization.accessLevel,
      dbRole: ctx.authorization.dbRole,
      authSource: ctx.userData.authSource,
    };
  }
}
