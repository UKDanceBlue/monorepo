import * as Context from "#resolvers/context.js";

import {
  AuthSource,
  DbRole,
  EffectiveCommitteeRole,
} from "@ukdanceblue/common";
import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Service } from "@freshgum/typedi";

@ObjectType("LoginState")
export class LoginState {
  @Field(() => Boolean)
  loggedIn!: boolean;

  @Field(() => DbRole)
  dbRole!: DbRole;

  @Field(() => AuthSource)
  authSource!: AuthSource;

  @Field(() => [EffectiveCommitteeRole])
  effectiveCommitteeRoles!: EffectiveCommitteeRole[];
}

@Resolver(() => LoginState)
@Service([])
export class LoginStateResolver {
  @Query(() => LoginState)
  loginState(@Ctx() ctx: Context.GraphQLContext): LoginState {
    return {
      loggedIn: ctx.authorization.dbRole !== DbRole.None,
      effectiveCommitteeRoles: ctx.authorization.committees,
      dbRole: ctx.authorization.dbRole,
      authSource: ctx.userData.authSource,
    };
  }
}
