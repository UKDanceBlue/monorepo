import { FundraisingEntryNode } from "@ukdanceblue/common";

import type { WideFundraisingEntryWithMeta } from "./FundraisingRepository.js";

export function fundraisingEntryModelToNode(
  entryModel: WideFundraisingEntryWithMeta
): Promise<FundraisingEntryNode> {
  let amount;
  let donatedByText;
  let donatedToText;
  let donatedOn;

  if (!entryModel.entrySource) {
    throw new Error("entrySource is missing");
  }
  if ("dbFundsEntry" in entryModel.entrySource) {
    ({
      amount,
      donatedBy: donatedByText,
      donatedTo: donatedToText,
      date: donatedOn,
    } = entryModel.entrySource.dbFundsEntry);
  } else if ("ddn" in entryModel.entrySource) {
    ({
      combinedAmount: amount,
      comment: donatedToText,
      combinedDonorName: donatedByText,
    } = entryModel.entrySource.ddn);
    donatedOn =
      entryModel.entrySource.ddn.pledgedDate ??
      entryModel.entrySource.ddn.transactionDate ??
      entryModel.entrySource.ddn.effectiveDate;
    if (!donatedOn) {
      throw new Error("donatedOn is missing");
    }
  } else {
    entryModel.entrySource satisfies never;
    throw new Error("entrySource is not a valid type");
  }

  return Promise.resolve(
    FundraisingEntryNode.init({
      id: entryModel.uuid,
      amount: amount.toDecimalPlaces(2).toNumber(),
      amountUnassigned:
        entryModel.unassigned?.toDecimalPlaces(2).toNumber() ?? 0,
      donatedByText,
      donatedToText,
      donatedOn,
      createdAt: entryModel.createdAt,
      updatedAt: entryModel.updatedAt,
    })
  );
}
