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
  @Field(() => Boolean, { nullable: false })
  loggedIn!: boolean;

  @Field(() => DbRole, { nullable: false })
  dbRole!: DbRole;

  @Field(() => AuthSource, { nullable: false })
  authSource!: AuthSource;

  @Field(() => AccessLevel, { nullable: false })
  accessLevel!: AccessLevel;

  @Field(() => [EffectiveCommitteeRole], { nullable: false })
  effectiveCommitteeRoles!: EffectiveCommitteeRole[];

  @Field(() => [[JSONResolver]], { nullable: false })
  abilityRules!: PackRule<AppAbility["rules"][number]>[];
}
