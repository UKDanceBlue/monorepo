import type { SolicitationCode } from "@prisma/client";
import {
  FundraisingEntryNode,
  SolicitationCodeNode,
} from "@ukdanceblue/common";
import { DateTime } from "luxon";

import type { WideFundraisingEntryWithMeta } from "./FundraisingRepository.js";

export function fundraisingEntryModelToNode(
  entryModel: WideFundraisingEntryWithMeta
): FundraisingEntryNode {
  return FundraisingEntryNode.init({
    id: entryModel.uuid,
    amount: entryModel.amount?.toDecimalPlaces(2).toNumber() ?? 0,
    amountOverride:
      entryModel.amountOverride?.toDecimalPlaces(2).toNumber() ?? null,
    amountUnassigned: entryModel.unassigned?.toDecimalPlaces(2).toNumber() ?? 0,
    donatedByText: entryModel.donatedBy,
    donatedByOverride: entryModel.donatedByOverride,
    donatedToText: entryModel.donatedTo,
    donatedToOverride: entryModel.donatedToOverride,
    donatedOn:
      entryModel.donatedOn && DateTime.fromJSDate(entryModel.donatedOn),
    donatedOnOverride:
      entryModel.donatedOnOverride &&
      DateTime.fromJSDate(entryModel.donatedOnOverride),
    createdAt: DateTime.fromJSDate(entryModel.createdAt),
    updatedAt: DateTime.fromJSDate(entryModel.updatedAt),
    notes: entryModel.notes,
    solicitationCodeOverride:
      entryModel.solicitationCodeOverride &&
      solicitationCodeModelToNode(entryModel.solicitationCodeOverride),
    batchType: entryModel.batchType,
    batchTypeOverride: entryModel.batchTypeOverride,
    source: entryModel.source,
  });
}

export function solicitationCodeModelToNode(
  solicitationCode: SolicitationCode
): SolicitationCodeNode {
  return SolicitationCodeNode.init({
    id: solicitationCode.uuid,
    prefix: solicitationCode.prefix,
    code: solicitationCode.code,
    name: solicitationCode.name,
    createdAt: DateTime.fromJSDate(solicitationCode.createdAt),
    updatedAt: DateTime.fromJSDate(solicitationCode.updatedAt),
  });
}
