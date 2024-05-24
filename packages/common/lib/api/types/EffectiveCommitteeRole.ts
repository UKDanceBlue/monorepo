import { Field, ObjectType } from "type-graphql";

import {
  CommitteeIdentifier,
  CommitteeRole,
} from "../../authorization/structures.js";

@ObjectType("EffectiveCommitteeRole")
export class EffectiveCommitteeRole {
  @Field(() => CommitteeIdentifier)
  committee!: CommitteeIdentifier;

  @Field(() => CommitteeRole)
  role!: CommitteeRole;

  public static init(
    committee: CommitteeIdentifier,
    role: CommitteeRole
  ): EffectiveCommitteeRole {
    const effectiveCommitteeRole = new this();
    effectiveCommitteeRole.committee = committee;
    effectiveCommitteeRole.role = role;
    return effectiveCommitteeRole;
  }
}
