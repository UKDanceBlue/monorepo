import { AuthSource, RoleResource } from "@ukdanceblue/common";
import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import * as Context from "./context.js";

@ObjectType("LoginState")
export class LoginState {
  @Field(() => Boolean)
  loggedIn!: boolean;

  @Field(() => RoleResource)
  role!: RoleResource;

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
      role: RoleResource.fromAuthorization(ctx.userData.auth),
      authSource: ctx.userData.authSource,
    };
  }
}
