import type { $1Node } from "@prisma/client";
import { MembershipNode } from "@ukdanceblue/common";

export function membershipModelToResource(
  membershipModel: $1Node
): MembershipNode {
  return MembershipNode.init({
    uuid: membershipModel.uuid,
    position: membershipModel.position,
    createdAt: membershipModel.createdAt,
    updatedAt: membershipModel.updatedAt,
  });
}
