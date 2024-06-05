import type { DBFundsFundraisingEntry, FundraisingEntry } from "@prisma/client";
import { FundraisingEntryNode } from "@ukdanceblue/common";

export function fundraisingEntryModelToNode(
  marathonHourModel: FundraisingEntry & {
    dbFundsEntry: DBFundsFundraisingEntry;
  }
): Promise<FundraisingEntryNode> {
  return Promise.resolve(
    FundraisingEntryNode.init({
      id: marathonHourModel.uuid,
      amount: marathonHourModel.dbFundsEntry.amount.toNumber(),
      donatedByText: marathonHourModel.dbFundsEntry.donatedBy,
      donatedToText: marathonHourModel.dbFundsEntry.donatedTo,
      donatedOn: marathonHourModel.dbFundsEntry.date,
      createdAt: marathonHourModel.createdAt,
      updatedAt: marathonHourModel.updatedAt,
    })
  );
}
