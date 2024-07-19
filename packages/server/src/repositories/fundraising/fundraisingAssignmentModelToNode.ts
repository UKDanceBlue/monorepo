import type { FundraisingAssignment } from "@prisma/client";
import { FundraisingAssignmentNode } from "@ukdanceblue/common";

export function fundraisingAssignmentModelToNode(
  marathonHourModel: FundraisingAssignment
): Promise<FundraisingAssignmentNode> {
  return Promise.resolve(
    FundraisingAssignmentNode.init({
      id: marathonHourModel.uuid,
      amount: marathonHourModel.amount.toNumber(),
      createdAt: marathonHourModel.createdAt,
      updatedAt: marathonHourModel.updatedAt,
    })
  );
}
