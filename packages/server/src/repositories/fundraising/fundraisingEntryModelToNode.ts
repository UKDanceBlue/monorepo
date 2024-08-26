import { FundraisingEntryNode } from "@ukdanceblue/common";

import type {
  DBFundsFundraisingEntry,
  FundraisingEntryWithMeta,
} from "@prisma/client";

export function fundraisingEntryModelToNode(
  entryModel: FundraisingEntryWithMeta & {
    dbFundsEntry: DBFundsFundraisingEntry;
  }
): Promise<FundraisingEntryNode> {
  return Promise.resolve(
    FundraisingEntryNode.init({
      id: entryModel.uuid,
      amount: entryModel.dbFundsEntry.amount.toDecimalPlaces(2).toNumber(),
      amountUnassigned:
        entryModel.unassigned?.toDecimalPlaces(2).toNumber() ?? 0,
      donatedByText: entryModel.dbFundsEntry.donatedBy,
      donatedToText: entryModel.dbFundsEntry.donatedTo,
      donatedOn: entryModel.dbFundsEntry.date,
      createdAt: entryModel.createdAt,
      updatedAt: entryModel.updatedAt,
    })
  );
}
