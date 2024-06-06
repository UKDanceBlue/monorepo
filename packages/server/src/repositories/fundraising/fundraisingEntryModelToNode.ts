import type { DBFundsFundraisingEntry, FundraisingEntry } from "@prisma/client";
import { FundraisingEntryNode } from "@ukdanceblue/common";

export function fundraisingEntryModelToNode(
  entryModel: FundraisingEntry & {
    dbFundsEntry: DBFundsFundraisingEntry;
  }
): Promise<FundraisingEntryNode> {
  return Promise.resolve(
    FundraisingEntryNode.init({
      id: entryModel.uuid,
      amount: entryModel.dbFundsEntry.amount.toNumber(),
      donatedByText: entryModel.dbFundsEntry.donatedBy,
      donatedToText: entryModel.dbFundsEntry.donatedTo,
      donatedOn: entryModel.dbFundsEntry.date,
      createdAt: entryModel.createdAt,
      updatedAt: entryModel.updatedAt,
    })
  );
}
