import { PackRule } from "@casl/ability/extra";
import { JSONResolver } from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";

import { AppAbility } from "../../authorization/accessControl.js";
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

  @Field(() => [[JSONResolver]])
  abilityRules!: PackRule<AppAbility["rules"][number]>[];
}
