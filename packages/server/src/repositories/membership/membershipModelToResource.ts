import type { Membership } from "@prisma/client";
import type { CommitteeIdentifier } from "@ukdanceblue/common";
import {
  CommitteeMembershipNode,
  DetailedError,
  ErrorCode,
  MembershipNode,
} from "@ukdanceblue/common";

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
  if (!membershipModel.committeeRole) {
    throw new DetailedError(
      ErrorCode.PreconditionsFailed,
      "Committee role is required"
    );
  }
  return CommitteeMembershipNode.init({
    id: membershipModel.uuid,
    position: membershipModel.position,
    identifier: committeeIdentifier,
    role: membershipModel.committeeRole,
    createdAt: membershipModel.createdAt,
    updatedAt: membershipModel.updatedAt,
  });
}
