import {
  CommitteeMembershipNode,
  CommitteeRole,
  MembershipNode,
} from "@ukdanceblue/common";

import type { Membership } from "@prisma/client";
import type { CommitteeIdentifier } from "@ukdanceblue/common";

export function membershipModelToResource(
  membershipModel: Membership
): MembershipNode {
  return MembershipNode.init({
    id: membershipModel.uuid,
    position: membershipModel.position,
    createdAt: membershipModel.createdAt,
    updatedAt: membershipModel.updatedAt,
  });
}

export function committeeMembershipModelToResource(
  membershipModel: Membership,
  committeeIdentifier: CommitteeIdentifier
): CommitteeMembershipNode {
  return CommitteeMembershipNode.init({
    id: membershipModel.uuid,
    position: membershipModel.position,
    identifier: committeeIdentifier,
    role: membershipModel.committeeRole ?? CommitteeRole.Member,
    createdAt: membershipModel.createdAt,
    updatedAt: membershipModel.updatedAt,
  });
}
