import { FundraisingAssignmentNode } from "@ukdanceblue/common";

import type { FundraisingAssignment } from "@prisma/client";

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
