import { eq, sql } from "drizzle-orm";

import { danceblue } from "#schema/core.sql.js";

import {
  dbFundsFundraisingEntry,
  dbFundsTeam,
} from "./tables/fundraising/dbFunds.sql.js";
import {
  dailyDepartmentNotification,
  dailyDepartmentNotificationBatch,
} from "./tables/fundraising/ddn.sql.js";
import {
  fundraisingAssignment,
  fundraisingEntry,
} from "./tables/fundraising/entry.sql.js";

export const fundraisingEntryWithMeta = danceblue
  .view("FundraisingEntryWithMeta")
  .as((qb) =>
    qb
      .select({
        id: fundraisingEntry.id,
        uuid: fundraisingEntry.uuid,
        createdAt: fundraisingEntry.createdAt,
        updatedAt: fundraisingEntry.updatedAt,
        unassigned:
          sql`COALESCE(${fundraisingEntry.amountOverride}, ${dbFundsFundraisingEntry.amount}, ${dailyDepartmentNotification.combinedAmount}) - COALESCE(( SELECT sum(assignment.amount) AS sum FROM "FundraisingAssignment" assignment WHERE assignment."fundraisingId" = ${fundraisingEntry.id}), 0::numeric(65,30))`.as(
            "unassigned"
          ),
        amount:
          sql`COALESCE(${fundraisingEntry.amountOverride}, ${dbFundsFundraisingEntry.amount}, ${dailyDepartmentNotification.combinedAmount})`.as(
            "amount"
          ),
        donatedTo:
          sql`COALESCE(${fundraisingEntry.donatedToOverride}, ${dbFundsFundraisingEntry.donatedTo}, ${dailyDepartmentNotification.comment})`.as(
            "donatedTo"
          ),
        donatedBy:
          sql`COALESCE(${fundraisingEntry.donatedByOverride}, ${dbFundsFundraisingEntry.donatedBy}, ${dailyDepartmentNotification.combinedDonorName})`.as(
            "donatedBy"
          ),
        donatedOn:
          sql`COALESCE(${fundraisingEntry.donatedOnOverride}::timestamp without time zone, ${dbFundsFundraisingEntry.date}, ${dailyDepartmentNotification.transactionDate}::timestamp without time zone)`.as(
            "donatedOn"
          ),
        notes: fundraisingEntry.notes,
        enteredByPersonId: fundraisingEntry.enteredByPersonId,
        solicitationCodeOverrideId: fundraisingEntry.solicitationCodeOverrideId,
        batchTypeOverride: fundraisingEntry.batchTypeOverride,
        donatedByOverride: fundraisingEntry.donatedByOverride,
        donatedOnOverride: fundraisingEntry.donatedOnOverride,
        donatedToOverride: fundraisingEntry.donatedToOverride,
        amountOverride: fundraisingEntry.amountOverride,
        solicitationCodeText: sql`(SELECT format(
          '%s%4s - %s',
          "sc"."prefix",
          to_char(
              "sc"."code",
              'fm9999999999999999999999999999999999999999999999990000'
          ),
          "sc"."name"
        )
        FROM "SolicitationCode" "sc"
        WHERE "sc"."id" = COALESCE(
          ${fundraisingEntry.solicitationCodeOverrideId},
          ${dailyDepartmentNotification.solicitationCodeId},
          ${dbFundsTeam.solicitationCodeId}
        ))`.as("solicitationCodeText"),
        batchType: sql`CASE
        WHEN ${fundraisingEntry.batchTypeOverride} IS NOT NULL THEN ${fundraisingEntry.batchTypeOverride}
        WHEN ${dailyDepartmentNotification.id} IS NULL THEN 'DBFunds'::"BatchType"
        WHEN ${dailyDepartmentNotificationBatch.id} IS NULL THEN NULL::"BatchType"
        WHEN "left"("right"(${dailyDepartmentNotificationBatch.batchId}, 2), 1) = 'C'::text THEN 'Check'::"BatchType"
        WHEN "left"("right"(${dailyDepartmentNotificationBatch.batchId}, 2), 1) = 'T'::text THEN 'Transmittal'::"BatchType"
        WHEN "left"("right"(${dailyDepartmentNotificationBatch.batchId}, 2), 1) = 'D'::text THEN 'CreditCard'::"BatchType"
        WHEN "left"("right"(${dailyDepartmentNotificationBatch.batchId}, 2), 1) = 'A'::text THEN 'ACH'::"BatchType"
        WHEN "left"("right"(${dailyDepartmentNotificationBatch.batchId}, 2), 1) = 'N'::text THEN 'NonCash'::"BatchType"
        WHEN "left"("right"(${dailyDepartmentNotificationBatch.batchId}, 2), 1) = 'X'::text THEN 'PayrollDeduction'::"BatchType"
        ELSE 'Unknown'::"BatchType"
      END`.as("batchType"),
      })
      .from(fundraisingEntry)
      .leftJoin(
        fundraisingAssignment,
        eq(fundraisingEntry.id, fundraisingAssignment.fundraisingId)
      )
      .leftJoin(
        dailyDepartmentNotification,
        eq(fundraisingEntry.id, dailyDepartmentNotification.fundraisingEntryId)
      )
      .leftJoin(
        dailyDepartmentNotificationBatch,
        eq(
          dailyDepartmentNotification.batchId,
          dailyDepartmentNotificationBatch.id
        )
      )
      .leftJoin(
        dbFundsFundraisingEntry,
        eq(fundraisingEntry.id, dbFundsFundraisingEntry.fundraisingEntryId)
      )
      .leftJoin(
        dbFundsTeam,
        eq(dbFundsFundraisingEntry.dbFundsTeamId, dbFundsTeam.id)
      )
  );
