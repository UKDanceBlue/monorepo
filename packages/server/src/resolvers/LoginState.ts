import { packRules } from "@casl/ability/extra";
import { Service } from "@freshgum/typedi";
import { AuthSource, DbRole } from "@ukdanceblue/common";
import { LoginState } from "@ukdanceblue/common";
import { Ctx, Query, Resolver } from "type-graphql";

import { type GraphQLContext } from "#auth/context.js";

@Resolver(() => LoginState)
@Service([])
export class LoginStateResolver {
  @Query(() => LoginState)
  loginState(@Ctx() ctx: GraphQLContext): LoginState {
    return {
      loggedIn: ctx.authSource !== AuthSource.None,
      effectiveCommitteeRoles: ctx.effectiveCommitteeRoles,
      accessLevel: ctx.accessLevel,
      dbRole: ctx.dbRole ?? DbRole.None,
      authSource: ctx.authSource,
      abilityRules: packRules(ctx.ability.rules),
    };
  }
}
