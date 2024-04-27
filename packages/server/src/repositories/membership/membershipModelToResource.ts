import type { Membership } from "@prisma/client";
import { MembershipNode } from "@ukdanceblue/common";

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
