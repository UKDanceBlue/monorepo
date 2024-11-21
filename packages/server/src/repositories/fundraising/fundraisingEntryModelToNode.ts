import type { SolicitationCode } from "@prisma/client";
import {
  FundraisingEntryNode,
  SolicitationCodeNode,
} from "@ukdanceblue/common";

import type { WideFundraisingEntryWithMeta } from "./FundraisingRepository.js";

export function fundraisingEntryModelToNode(
  entryModel: WideFundraisingEntryWithMeta
): Promise<FundraisingEntryNode> {
  let amount;
  let donatedByText;
  let donatedToText;
  let donatedOn;

  if (!entryModel) {
    throw new Error("entrySource is missing");
  }
  if ("dbFundsEntry" in entryModel) {
    ({
      amount,
      donatedBy: donatedByText,
      donatedTo: donatedToText,
      date: donatedOn,
    } = entryModel.dbFundsEntry);
  } else if ("ddn" in entryModel) {
    ({
      combinedAmount: amount,
      comment: donatedToText,
      combinedDonorName: donatedByText,
    } = entryModel.ddn);
    donatedOn =
      entryModel.ddn.pledgedDate ??
      entryModel.ddn.transactionDate ??
      entryModel.ddn.effectiveDate;
    if (!donatedOn) {
      throw new Error("donatedOn is missing");
    }
  } else {
    entryModel satisfies never;
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
      notes: entryModel.notes,
      solicitationCodeOverride:
        entryModel.solicitationCodeOverride &&
        solicitationCodeModelToNode(entryModel.solicitationCodeOverride),
    })
  );
}

export function solicitationCodeModelToNode(
  solicitationCode: SolicitationCode
): SolicitationCodeNode {
  return SolicitationCodeNode.init({
    id: solicitationCode.uuid,
    prefix: solicitationCode.prefix,
    code: solicitationCode.code,
    name: solicitationCode.name,
    createdAt: solicitationCode.createdAt,
    updatedAt: solicitationCode.updatedAt,
  });
}
