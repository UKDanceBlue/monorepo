/*
 Warnings:
 
 - You are about to drop the column `solicitationCodeId` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `enteredBy` on the `FundraisingEntry` table. All the data in the column will be lost.
 - You are about to drop the column `entrySourceId` on the `FundraisingEntry` table. All the data in the column will be lost.
 - You are about to drop the `FundraisingEntrySource` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[fundraisingEntryId]` on the table `DBFundsFundraisingEntry` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[fundraisingEntryId]` on the table `DailyDepartmentNotification` will be added. If there are existing duplicate values, this will fail.
 - Made the column `fundraisingEntryId` on table `DBFundsFundraisingEntry` required. This step will fail if there are existing NULL values in that column.
 - Added the required column `fundraisingEntryId` to the `DailyDepartmentNotification` table without a default value. This is not possible if the table is not empty.
 - Added the required column `solicitationCodeId` to the `FundraisingEntry` table without a default value. This is not possible if the table is not empty.
 
 */
BEGIN;

-- DropForeignKey
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_enteredBy_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntrySource" DROP CONSTRAINT "FundraisingEntrySource_dbFundsEntryId_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntrySource" DROP CONSTRAINT "FundraisingEntrySource_ddnId_fkey";

-- DropIndex
DROP INDEX "FundraisingEntry_entrySourceId_key";

DROP VIEW "FundraisingEntriesWithMeta";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ADD COLUMN "fundraisingEntryId" INTEGER;

-- AlterTable
ALTER TABLE "FundraisingEntry"
ADD COLUMN "enteredByPersonId" INTEGER,
  ADD COLUMN "solicitationCodeId" INTEGER;

UPDATE "FundraisingEntry"
SET "solicitationCodeId" = "DailyDepartmentNotification"."solicitationCodeId"
FROM "FundraisingEntrySource"
  INNER JOIN "DailyDepartmentNotification" ON "FundraisingEntrySource"."ddnId" = "DailyDepartmentNotification"."id"
WHERE "FundraisingEntry"."entrySourceId" = "FundraisingEntrySource"."id"
  AND "DailyDepartmentNotification"."solicitationCodeId" IS NOT NULL;

UPDATE "FundraisingEntry"
SET "solicitationCodeId" = "DBFundsTeam"."solicitationCodeId"
FROM "FundraisingEntrySource"
  INNER JOIN "DBFundsFundraisingEntry" ON "FundraisingEntrySource"."dbFundsEntryId" = "DBFundsFundraisingEntry"."id"
  INNER JOIN "DBFundsTeam" ON "DBFundsFundraisingEntry"."dbFundsTeamId" = "DBFundsTeam"."id"
WHERE "FundraisingEntry"."entrySourceId" = "FundraisingEntrySource"."id"
  AND "DBFundsTeam"."solicitationCodeId" IS NOT NULL;

UPDATE "DailyDepartmentNotification"
SET "fundraisingEntryId" = "FundraisingEntry"."id"
FROM "FundraisingEntrySource"
  INNER JOIN "FundraisingEntry" ON "FundraisingEntrySource"."entryId" = "FundraisingEntry"."id"
WHERE "DailyDepartmentNotification"."id" = "FundraisingEntrySource"."ddnId";

-- AlterTable
ALTER TABLE "DBFundsFundraisingEntry"
ALTER COLUMN "fundraisingEntryId"
SET NOT NULL;

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ALTER COLUMN "fundraisingEntryId"
SET NOT NULL;

-- AlterTable
ALTER TABLE "FundraisingEntry"
ALTER COLUMN "solicitationCodeId"
SET NOT NULL;

-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP COLUMN "solicitationCodeId";

-- AlterTable
ALTER TABLE "FundraisingEntry" DROP COLUMN "enteredBy",
  DROP COLUMN "entrySourceId";

-- DropTable
DROP TABLE "FundraisingEntrySource";

CREATE VIEW "FundraisingEntryWithMeta" AS
SELECT "fe"."id",
  "fe"."uuid",
  "fe"."createdAt",
  "fe"."updatedAt",
  "fe"."teamOverrideId",
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

-- CreateIndex
CREATE UNIQUE INDEX "DBFundsFundraisingEntry_fundraisingEntryId_key" ON "DBFundsFundraisingEntry"("fundraisingEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_fundraisingEntryId_key" ON "DailyDepartmentNotification"("fundraisingEntryId");

-- AddForeignKey
ALTER TABLE "DBFundsFundraisingEntry"
ADD CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_enteredByPersonId_fkey" FOREIGN KEY ("enteredByPersonId") REFERENCES "Person"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingAssignment"
ADD CONSTRAINT "fundraising_assignment_parent_entry" FOREIGN KEY ("fundraisingId") REFERENCES "FundraisingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;