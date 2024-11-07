import type {
  DailyDepartmentNotification,
  DailyDepartmentNotificationBatch,
} from "@prisma/client";
import {
  DailyDepartmentNotificationBatchNode,
  DailyDepartmentNotificationNode,
} from "@ukdanceblue/common";

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
  ddn: DailyDepartmentNotification
): DailyDepartmentNotificationNode {
  return DailyDepartmentNotificationNode.init({
    division: ddn.division ?? undefined,
    department: ddn.department ?? undefined,
    effectiveDate: stringifyDate(ddn.effectiveDate),
    processDate: stringifyDate(ddn.processDate),
    pledgedDate: stringifyDate(ddn.pledgedDate),
    transactionDate: stringifyDate(ddn.transactionDate),
    transactionType: ddn.transactionType,
    donor1Amount: ddn.donor1Amount?.toNumber() ?? undefined,
    donor2Amount: ddn.donor2Amount?.toNumber() ?? undefined,
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
    solicitationCode: ddn.solicitationCode ?? undefined,
    solicitation: ddn.solicitation ?? undefined,
    behalfHonorMemorial: ddn.behalfHonorMemorial ?? undefined,
    matchingGift: ddn.matchingGift ?? undefined,
    ukFirstGift: ddn.ukFirstGift,
    divFirstGift: ddn.divFirstGift,
    idSorter: ddn.idSorter,
    combinedDonorName: ddn.combinedDonorName,
    combinedDonorSalutation: ddn.combinedDonorSalutation,
    combinedDonorSort: ddn.combinedDonorSort ?? undefined,
    donor1Id: ddn.donor1Id ?? undefined,
    donor1GiftKey: ddn.donor1GiftKey ?? undefined,
    donor1Name: ddn.donor1Name ?? undefined,
    donor1Deceased: ddn.donor1Deceased ?? undefined,
    donor1Constituency: ddn.donor1Constituency ?? undefined,
    donor1TitleBar: ddn.donor1TitleBar ?? undefined,
    donor1Pm: ddn.donor1Pm ?? undefined,
    donor1Degrees: ddn.donor1Degrees ?? undefined,
    donor2Id: ddn.donor2Id ?? undefined,
    donor2GiftKey: ddn.donor2GiftKey ?? undefined,
    donor2Name: ddn.donor2Name ?? undefined,
    donor2Deceased: ddn.donor2Deceased ?? undefined,
    donor2Constituency: ddn.donor2Constituency ?? undefined,
    donor2TitleBar: ddn.donor2TitleBar ?? undefined,
    donor2Pm: ddn.donor2Pm ?? undefined,
    donor2Degrees: ddn.donor2Degrees ?? undefined,
    donor1Relation: ddn.donor1Relation ?? undefined,
    donor2Relation: ddn.donor2Relation ?? undefined,
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
  ddn: DailyDepartmentNotificationBatch
): DailyDepartmentNotificationBatchNode {
  return DailyDepartmentNotificationBatchNode.init({
    batchId: ddn.batchId,
    batchType: ddn.batchType,
  });
}
