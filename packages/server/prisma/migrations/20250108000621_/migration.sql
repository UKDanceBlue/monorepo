/*
 Warnings:
 
 - A unique constraint covering the columns `[idSorter,processDate,batchId,solicitationCodeId,combinedAmount]` on the table `DailyDepartmentNotification` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[marathonId,correspondingCommitteeId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
 
 */
-- DropForeignKey
ALTER TABLE "PointEntry" DROP CONSTRAINT "PointEntry_pointOpportunityId_fkey";

-- AlterTable
ALTER TABLE "PointEntry"
ALTER COLUMN "pointOpportunityId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key" ON "DailyDepartmentNotification"(
  "idSorter",
  "processDate",
  "batchId",
  "solicitationCodeId",
  "combinedAmount"
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_marathonId_correspondingCommitteeId_key" ON "Team"("marathonId", "correspondingCommitteeId");

-- AddForeignKey
ALTER TABLE "PointEntry"
ADD CONSTRAINT "PointEntry_pointOpportunityId_fkey" FOREIGN KEY ("pointOpportunityId") REFERENCES "PointOpportunity"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

DROP VIEW "danceblue"."FundraisingEntryWithMeta";

CREATE VIEW "danceblue"."FundraisingEntryWithMeta" AS (
  SELECT "danceblue"."FundraisingEntry"."id",
    "danceblue"."FundraisingEntry"."uuid",
    "danceblue"."FundraisingEntry"."createdAt",
    "danceblue"."FundraisingEntry"."updatedAt",
    COALESCE(
      "danceblue"."FundraisingEntry"."amountOverride",
      "danceblue"."DBFundsFundraisingEntry"."amount",
      "danceblue"."DailyDepartmentNotification"."combinedAmount"
    ) - COALESCE(
      (
        SELECT sum("amount")
        FROM "danceblue"."FundraisingAssignment"
        WHERE "danceblue"."FundraisingAssignment"."fundraisingId" = "danceblue"."FundraisingEntry"."id"
      ),
      0::numeric(65, 30)
    ) AS "unassigned",
    COALESCE(
      "danceblue"."FundraisingEntry"."amountOverride",
      "danceblue"."DBFundsFundraisingEntry"."amount",
      "danceblue"."DailyDepartmentNotification"."combinedAmount"
    ) AS "amount",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedToOverride",
      "danceblue"."DBFundsFundraisingEntry"."donatedTo",
      "danceblue"."DailyDepartmentNotification"."comment"
    ) AS "donatedTo",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedByOverride",
      "danceblue"."DBFundsFundraisingEntry"."donatedBy",
      "danceblue"."DailyDepartmentNotification"."combinedDonorName"
    ) AS "donatedBy",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedOnOverride"::timestamp without time zone,
      "danceblue"."DBFundsFundraisingEntry"."date",
      "danceblue"."DailyDepartmentNotification"."transactionDate"::timestamp without time zone
    ) AS "donatedOn",
    "danceblue"."FundraisingEntry"."notes",
    "danceblue"."FundraisingEntry"."enteredByPersonId",
    "danceblue"."FundraisingEntry"."solicitationCodeOverrideId",
    "danceblue"."FundraisingEntry"."batchTypeOverride",
    "danceblue"."FundraisingEntry"."donatedByOverride",
    "danceblue"."FundraisingEntry"."donatedOnOverride",
    "danceblue"."FundraisingEntry"."donatedToOverride",
    "danceblue"."FundraisingEntry"."amountOverride",
    "danceblue"."SolicitationCode"."text" AS "solicitationCodeText",
    "danceblue"."SolicitationCode"."id" AS "solicitationCodeId",
    CASE
      WHEN "danceblue"."FundraisingEntry"."batchTypeOverride" IS NOT NULL THEN "danceblue"."FundraisingEntry"."batchTypeOverride"
      WHEN "danceblue"."DailyDepartmentNotification"."id" IS NULL THEN 'DBFunds'::"BatchType"
      WHEN "danceblue"."DailyDepartmentNotificationBatch"."id" IS NULL THEN NULL::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'C'::text THEN 'Check'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'T'::text THEN 'Transmittal'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'D'::text THEN 'CreditCard'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'A'::text THEN 'ACH'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'N'::text THEN 'NonCash'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'X'::text THEN 'PayrollDeduction'::"BatchType"
      ELSE 'Unknown'::"BatchType"
    END AS "batchType"
  FROM "danceblue"."FundraisingEntry"
    LEFT JOIN "danceblue"."FundraisingAssignment" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."FundraisingAssignment"."fundraisingId"
    LEFT JOIN "danceblue"."DailyDepartmentNotification" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."DailyDepartmentNotification"."fundraisingEntryId"
    LEFT JOIN "danceblue"."DailyDepartmentNotificationBatch" ON "danceblue"."DailyDepartmentNotification"."batchId" = "danceblue"."DailyDepartmentNotificationBatch"."id"
    LEFT JOIN "danceblue"."DBFundsFundraisingEntry" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."DBFundsFundraisingEntry"."fundraisingEntryId"
    LEFT JOIN "danceblue"."DBFundsTeam" ON "danceblue"."DBFundsFundraisingEntry"."dbFundsTeamId" = "danceblue"."DBFundsTeam"."id"
    LEFT JOIN "danceblue"."SolicitationCode" ON "danceblue"."SolicitationCode"."id" = COALESCE(
      "danceblue"."FundraisingEntry"."solicitationCodeOverrideId",
      "danceblue"."DailyDepartmentNotification"."solicitationCodeId",
      "danceblue"."DBFundsTeam"."solicitationCodeId"
    )
);