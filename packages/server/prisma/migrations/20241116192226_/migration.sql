/*
 Warnings:
 
 - You are about to drop the column `teamOverrideId` on the `FundraisingEntry` table. All the data in the column will be lost.
 
 */
DROP VIEW "FundraisingEntryWithMeta";

CREATE VIEW "FundraisingEntryWithMeta" AS
SELECT "fe"."id",
  "fe"."uuid",
  "fe"."createdAt",
  "fe"."updatedAt",
  COALESCE(
    -- Calculate unassigned using db_funds_team_entries if available
    (
      SELECT "dft"."amount"
      FROM "DBFundsFundraisingEntry" "dft"
      WHERE "fe"."id" = "dft"."fundraisingEntryId"
    ),
    -- Otherwise, use combinedAmount from DailyDepartmentNotification
    (
      SELECT "ddn"."combinedAmount"
      FROM "DailyDepartmentNotification" "ddn"
      WHERE "fe"."id" = "ddn"."fundraisingEntryId"
    )
  ) - COALESCE(
    (
      SELECT SUM("assignment"."amount")
      FROM "FundraisingAssignment" "assignment"
      WHERE "assignment"."fundraisingId" = "fe"."id"
    ),
    0::numeric(65, 30)
  ) AS "unassigned",
  "fe"."notes",
  "fe"."type",
  "fe"."enteredByPersonId",
  "fe"."solicitationCodeId"
FROM "FundraisingEntry" "fe";

-- AlterTable
ALTER TABLE "FundraisingEntry" DROP COLUMN "teamOverrideId";