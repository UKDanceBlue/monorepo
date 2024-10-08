import {
  CommitteeIdentifier,
  CommitteeRole,
} from "../../authorization/structures.js";

import { Field, ObjectType } from "type-graphql";

@ObjectType("EffectiveCommitteeRole")
export class EffectiveCommitteeRole {
  @Field(() => CommitteeIdentifier)
  identifier!: CommitteeIdentifier;

  @Field(() => CommitteeRole)
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
