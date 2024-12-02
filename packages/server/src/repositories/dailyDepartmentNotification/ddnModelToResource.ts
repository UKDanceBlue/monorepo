import type {
  DailyDepartmentNotification,
  DailyDepartmentNotificationBatch,
  DDNDonor,
  DDNDonorLink,
  SolicitationCode,
} from "@prisma/client";
import {
  DailyDepartmentNotificationBatchNode,
  DailyDepartmentNotificationNode,
} from "@ukdanceblue/common";

import { solicitationCodeModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";

function stringifyDate(date: Date | null): string | undefined {
  if (date == null) {
    return undefined;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

export function dailyDepartmentNotificationModelToResource(
  ddn: DailyDepartmentNotification & {
    solicitationCode: SolicitationCode;
    donors: (DDNDonorLink & { donor: DDNDonor })[];
  }
): DailyDepartmentNotificationNode {
  return DailyDepartmentNotificationNode.init({
    id: ddn.uuid,
    division: ddn.division ?? undefined,
    department: ddn.department ?? undefined,
    effectiveDate: stringifyDate(ddn.effectiveDate),
    processDate: stringifyDate(ddn.processDate),
    pledgedDate: stringifyDate(ddn.pledgedDate),
    transactionDate: stringifyDate(ddn.transactionDate),
    transactionType: ddn.transactionType,
    donor1Amount: ddn.donors[0]?.amount?.toNumber() ?? undefined,
    donor2Amount: ddn.donors[1]?.amount?.toNumber() ?? undefined,
    combinedAmount: ddn.combinedAmount.toNumber(),
    pledgedAmount: ddn.pledgedAmount.toNumber(),
    accountNumber: ddn.accountNumber,
    accountName: ddn.accountName,
    holdingDestination: ddn.holdingDestination ?? undefined,
    comment: ddn.comment ?? undefined,
    secShares: ddn.secShares ?? undefined,
    secType: ddn.secType ?? undefined,
    gikType: ddn.gikType ?? undefined,
    gikDescription: ddn.gikDescription ?? undefined,
    onlineGift: ddn.onlineGift,
    solicitationCode: solicitationCodeModelToNode(ddn.solicitationCode),
    solicitation: ddn.solicitation ?? undefined,
    behalfHonorMemorial: ddn.behalfHonorMemorial ?? undefined,
    matchingGift: ddn.matchingGift ?? undefined,
    ukFirstGift: ddn.ukFirstGift,
    divFirstGift: ddn.divFirstGift,
    idSorter: ddn.idSorter,
    combinedDonorName: ddn.combinedDonorName,
    combinedDonorSalutation: ddn.combinedDonorSalutation,
    combinedDonorSort: ddn.combinedDonorSort ?? undefined,
    donor1Id: ddn.donors[0]?.donor.donorId ?? undefined,
    donor1GiftKey: ddn.donors[0]?.donor.giftKey ?? undefined,
    donor1Name: ddn.donors[0]?.donor.name ?? undefined,
    donor1Deceased: ddn.donors[0]?.donor.deceased ?? undefined,
    donor1Constituency: ddn.donors[0]?.donor.constituency ?? undefined,
    donor1TitleBar: ddn.donors[0]?.donor.titleBar ?? undefined,
    donor1Pm: ddn.donors[0]?.donor.pm ?? undefined,
    donor1Degrees: ddn.donors[0]?.donor.degrees?.join(", ") ?? undefined,
    donor2Id: ddn.donors[1]?.donor.donorId ?? undefined,
    donor2GiftKey: ddn.donors[1]?.donor.giftKey ?? undefined,
    donor2Name: ddn.donors[1]?.donor.name ?? undefined,
    donor2Deceased: ddn.donors[1]?.donor.deceased ?? undefined,
    donor2Constituency: ddn.donors[1]?.donor.constituency ?? undefined,
    donor2TitleBar: ddn.donors[1]?.donor.titleBar ?? undefined,
    donor2Pm: ddn.donors[1]?.donor.pm ?? undefined,
    donor2Degrees: ddn.donors[1]?.donor.degrees?.join(", ") ?? undefined,
    donor1Relation: ddn.donors[0]?.relation ?? undefined,
    donor2Relation: ddn.donors[1]?.relation ?? undefined,
    transmittalSn: ddn.transmittalSn ?? undefined,
    sapDocNum: ddn.sapDocNum ?? undefined,
    sapDocDate: stringifyDate(ddn.sapDocDate),
    jvDocNum: ddn.jvDocNum ?? undefined,
    jvDocDate: stringifyDate(ddn.jvDocDate),
    advFeeCcPhil: ddn.advFeeCcPhil ?? undefined,
    advFeeAmtPhil: ddn.advFeeAmtPhil?.toNumber(),
    advFeeCcUnit: ddn.advFeeCcUnit ?? undefined,
    advFeeAmtUnit: ddn.advFeeAmtUnit?.toNumber(),
    advFeeStatus: ddn.advFeeStatus ?? undefined,
    hcUnit: ddn.hcUnit ?? undefined,
  });
}

export function dailyDepartmentNotificationBatchModelToResource(
  batch: DailyDepartmentNotificationBatch
): DailyDepartmentNotificationBatchNode {
  return DailyDepartmentNotificationBatchNode.init({
    batchNumber: batch.batchId,
    id: batch.uuid,
  });
}
