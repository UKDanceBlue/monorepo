import { TimestampedResource } from "./Resource.js";

import {
  CommitteeIdentifier,
  CommitteeRole,
} from "../../authorization/structures.js";
import { Node, createNodeClasses } from "../relay.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { Field, ObjectType, registerEnumType } from "type-graphql";

import type { GlobalId } from "../scalars/GlobalId.js";

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
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => MembershipPositionType)
  position!: MembershipPositionType;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    position: MembershipPositionType;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    return MembershipNode.createInstance().withValues(init);
  }
}

@ObjectType({
  implements: [Node],
})
export class CommitteeMembershipNode extends MembershipNode implements Node {
  @Field(() => CommitteeRole)
  role!: CommitteeRole;

  @Field(() => CommitteeIdentifier)
  identifier!: CommitteeIdentifier;

  public static init(init: {
    id: string;
    position: MembershipPositionType;
    identifier: CommitteeIdentifier;
    role: CommitteeRole;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    return CommitteeMembershipNode.createInstance().withValues(init);
  }
}

export const { MembershipConnection, MembershipEdge, MembershipResult } =
  createNodeClasses(MembershipNode, "Membership");
export const {
  CommitteeMembershipConnection,
  CommitteeMembershipEdge,
  CommitteeMembershipResult,
} = createNodeClasses(CommitteeMembershipNode, "CommitteeMembership");
