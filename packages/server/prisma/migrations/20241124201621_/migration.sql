/*
 Warnings:
 
 - Changed the type of `batchId` on the `DailyDepartmentNotification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
 
 */
-- CreateEnum
CREATE TYPE "BatchType" AS ENUM (
  'DBFunds',
  'Check',
  'Transmittal',
  'CreditCard',
  'ACH',
  'NonCash',
  'PayrollDeduction',
  'Unknown'
);

-- DropForeignKey
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_batchId_fkey";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP COLUMN "batchId",
  ADD COLUMN "batchId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key" ON "DailyDepartmentNotification"(
  "idSorter",
  "processDate",
  "batchId",
  "solicitationCodeId",
  "combinedAmount"
);

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "DailyDepartmentNotificationBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP VIEW "FundraisingEntryWithMeta";

CREATE VIEW "FundraisingEntryWithMeta" AS
SELECT "fe"."id",
  "fe"."uuid",
  "fe"."createdAt",
  "fe"."updatedAt",
  COALESCE(
    -- Calculate unassigned using db_funds_team_entries if available
    "dfe"."amount",
    -- Otherwise, use combinedAmount from DailyDepartmentNotification
    "ddn"."combinedAmount"
  ) - COALESCE(
    (
      SELECT SUM("assignment"."amount")
      FROM "FundraisingAssignment" "assignment"
      WHERE "assignment"."fundraisingId" = "fe"."id"
    ),
    0::numeric(65, 30)
  ) AS "unassigned",
  COALESCE(
    "dfe"."amount",
    "ddn"."combinedAmount"
  ) AS "amount",
  COALESCE("dfe"."donatedTo", "ddn"."comment") AS "donatedTo",
  COALESCE(
    "dfe"."donatedBy",
    "ddn"."combinedDonorName"
  ) AS "donatedBy",
  COALESCE("dfe"."date", "ddn"."transactionDate") AS "donatedOn",
  "fe"."notes",
  "fe"."enteredByPersonId",
  "fe"."solicitationCodeId" AS "solicitationCodeOverrideId",
  (
    SELECT format(
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
        "fe"."solicitationCodeId",
        "ddn"."solicitationCodeId",
        "dft"."solicitationCodeId"
      )
  ) AS "solicitationCodeText",
  CASE
    WHEN "ddn" IS NULL THEN 'DBFunds'::"BatchType"
    WHEN "ddnb" IS NULL THEN NULL
    WHEN left(right("ddnb"."batchId", 2), 1) = 'C' THEN 'Check'::"BatchType"
    WHEN left(right("ddnb"."batchId", 2), 1) = 'T' THEN 'Transmittal'::"BatchType"
    WHEN left(right("ddnb"."batchId", 2), 1) = 'D' THEN 'CreditCard'::"BatchType"
    WHEN left(right("ddnb"."batchId", 2), 1) = 'A' THEN 'ACH'::"BatchType"
    WHEN left(right("ddnb"."batchId", 2), 1) = 'N' THEN 'NonCash'::"BatchType"
    WHEN left(right("ddnb"."batchId", 2), 1) = 'X' THEN 'PayrollDeduction'::"BatchType"
    ELSE 'Unknown'::"BatchType"
  END AS "batchType"
FROM "FundraisingEntry" "fe"
  LEFT OUTER JOIN "DailyDepartmentNotification" "ddn" ON "fe"."id" = "ddn"."fundraisingEntryId"
  LEFT OUTER JOIN "DailyDepartmentNotificationBatch" "ddnb" ON "ddn"."batchId" = "ddnb"."id"
  LEFT OUTER JOIN "DBFundsFundraisingEntry" "dfe" ON "fe"."id" = "dfe"."fundraisingEntryId"
  LEFT OUTER JOIN "DBFundsTeam" "dft" ON "dfe"."dbFundsTeamId" = "dft"."id";