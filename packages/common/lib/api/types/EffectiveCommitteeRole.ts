import { Field, ObjectType } from "type-graphql";

import {
  CommitteeIdentifier,
  CommitteeRole,
} from "../../authorization/structures.js";

@ObjectType("EffectiveCommitteeRole")
export class EffectiveCommitteeRole {
  @Field(() => CommitteeIdentifier, { nullable: false })
  identifier!: CommitteeIdentifier;

  @Field(() => CommitteeRole, { nullable: false })
  role!: CommitteeRole;

  public static init(
    identifier: CommitteeIdentifier,
    role: CommitteeRole
  ): EffectiveCommitteeRole {
    const effectiveCommitteeRole = new this();
    effectiveCommitteeRole.identifier = identifier;
    effectiveCommitteeRole.role = role;
    return effectiveCommitteeRole;
  }
}
