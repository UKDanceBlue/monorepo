import { DateTime } from "luxon";
import { Field, ObjectType, registerEnumType } from "type-graphql";

import {
  CommitteeIdentifier,
  CommitteeRole,
} from "../../authorization/structures.js";
import { Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

export const MembershipPositionType = {
  Member: "Member",
  Captain: "Captain",
} as const;
export type MembershipPositionType =
  (typeof MembershipPositionType)[keyof typeof MembershipPositionType];

registerEnumType(MembershipPositionType, {
  name: "MembershipPositionType",
  description: "The position of a member on a team",
});

@ObjectType({
  implements: [Node],
})
export class MembershipNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar, { nullable: false })
  id!: GlobalId;

  @Field(() => MembershipPositionType, { nullable: false })
  position!: MembershipPositionType;

  public getUniqueId(): string {
    return this.id.id;
  }

  @Field(() => String, { nullable: false })
  text(): string {
    return this.position;
  }

  public static init(init: {
    id: string;
    position: MembershipPositionType;
    createdAt?: DateTime | undefined | null;
    updatedAt?: DateTime | undefined | null;
  }) {
    return MembershipNode.createInstance().withValues(init);
  }
}

@ObjectType({
  implements: [Node],
})
export class CommitteeMembershipNode extends MembershipNode implements Node {
  @Field(() => CommitteeRole, { nullable: false })
  role!: CommitteeRole;

  @Field(() => CommitteeIdentifier, { nullable: false })
  identifier!: CommitteeIdentifier;

  @Field(() => String, { nullable: false })
  text(): string {
    return `${this.role} of ${this.identifier}`;
  }

  public static init(init: {
    id: string;
    position: MembershipPositionType;
    identifier: CommitteeIdentifier;
    role: CommitteeRole;
    createdAt?: DateTime | undefined | null;
    updatedAt?: DateTime | undefined | null;
  }) {
    return CommitteeMembershipNode.createInstance().withValues(init);
  }
}
