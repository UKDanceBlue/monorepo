import { MembershipNode } from "@ukdanceblue/common";

export function membershipModelToResource(
  membershipModel: MembershipNode
): MembershipNode {
  return MembershipNode.init({
    uuid: membershipModel.uuid,
    position: membershipModel.position,
    createdAt: membershipModel.createdAt,
    updatedAt: membershipModel.updatedAt,
  });
}
