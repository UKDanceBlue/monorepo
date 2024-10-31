import { Field,ObjectType } from "type-graphql";

import {
  AccessLevel,
  Authorization,
  AuthSource,
  DbRole,
} from "../../authorization/structures.js";
import { EffectiveCommitteeRole } from "../types/EffectiveCommitteeRole.js";

@ObjectType("LoginState")
export class LoginState implements Authorization {
  @Field(() => Boolean)
  loggedIn!: boolean;

  @Field(() => DbRole)
  dbRole!: DbRole;

  @Field(() => AuthSource)
  authSource!: AuthSource;

  @Field(() => AccessLevel)
  accessLevel!: AccessLevel;

  @Field(() => [EffectiveCommitteeRole])
  effectiveCommitteeRoles!: EffectiveCommitteeRole[];
}
