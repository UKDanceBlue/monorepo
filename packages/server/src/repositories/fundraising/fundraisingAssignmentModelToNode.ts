import type { FundraisingAssignment } from "@prisma/client";
import { FundraisingAssignmentNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function fundraisingAssignmentModelToNode(
  marathonHourModel: FundraisingAssignment
): Promise<FundraisingAssignmentNode> {
  return Promise.resolve(
    FundraisingAssignmentNode.init({
      id: marathonHourModel.uuid,
      amount: marathonHourModel.amount.toNumber(),
      createdAt: DateTime.fromJSDate(marathonHourModel.createdAt),
      updatedAt: DateTime.fromJSDate(marathonHourModel.updatedAt),
    })
  );
}
