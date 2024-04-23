import { AuthSource, DbRole } from "@ukdanceblue/common";
import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import * as Context from "./context.js";

@ObjectType("LoginState")
export class LoginState {
  @Field(() => Boolean)
  loggedIn!: boolean;

  @Field(() => DbRole)
  dbRole!: DbRole;

  @Field(() => AuthSource)
  authSource!: AuthSource;
}

@Resolver(() => LoginState)
@Service()
export class LoginStateResolver {
  @Query(() => LoginState)
  loginState(@Ctx() ctx: Context.GraphQLContext): LoginState {
    return {
      loggedIn: ctx.authenticatedUser != null,
      dbRole: ctx.userData.auth.dbRole,
      authSource: ctx.userData.authSource,
    };
  }
}
