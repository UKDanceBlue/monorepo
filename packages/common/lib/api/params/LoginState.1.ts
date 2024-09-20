import {
  DbRole,
  AuthSource,
  EffectiveCommitteeRole,
} from "@ukdanceblue/common";
import { ObjectType, Field } from "type-graphql";

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
