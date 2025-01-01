import type { Membership } from "@prisma/client";
import type { CommitteeIdentifier } from "@ukdanceblue/common";
import {
  CommitteeMembershipNode,
  CommitteeRole,
  MembershipNode,
} from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function membershipModelToResource(
  membershipModel: Membership
): MembershipNode {
  return MembershipNode.init({
    id: membershipModel.uuid,
    position: membershipModel.position,
    createdAt: DateTime.fromJSDate(membershipModel.createdAt),
    updatedAt: DateTime.fromJSDate(membershipModel.updatedAt),
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
    createdAt: DateTime.fromJSDate(membershipModel.createdAt),
    updatedAt: DateTime.fromJSDate(membershipModel.updatedAt),
  });
}
