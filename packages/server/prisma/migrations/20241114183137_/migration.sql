/*
 Warnings:
 
 - You are about to drop the column `dbNum` on the `DBFundsTeam` table. All the data in the column will be lost.
 - You are about to drop the column `solicitationCode` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - The `donor1GiftKey` column on the `DailyDepartmentNotification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
 - The `donor2GiftKey` column on the `DailyDepartmentNotification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
 - A unique constraint covering the columns `[solicitationCodeId,marathonId]` on the table `DBFundsTeam` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `solicitationCodeId` to the `DBFundsTeam` table without a default value. This is not possible if the table is not empty.
 - Added the required column `solicitationCodeId` to the `DailyDepartmentNotification` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_dbFundsTeamId_fkey";
-- DropIndex
DROP INDEX "DBFundsTeam_dbNum_marathonId_key";
-- AlterTable
ALTER TABLE "DBFundsTeam"
ADD COLUMN "solicitationCodeId" INTEGER NOT NULL;
-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP COLUMN "solicitationCode",
  ADD COLUMN "solicitationCodeId" INTEGER NOT NULL,
  DROP COLUMN "donor1GiftKey",
  ADD COLUMN "donor1GiftKey" INTEGER,
  DROP COLUMN "donor2GiftKey",
  ADD COLUMN "donor2GiftKey" INTEGER;
-- AlterTable
ALTER TABLE "FundraisingEntry"
ADD COLUMN "teamOverrideId" INTEGER;
-- AlterTable
ALTER TABLE "Team"
ADD COLUMN "solicitationCodeId" INTEGER;
-- CreateTable
CREATE TABLE "SolicitationCode" (
  "id" SERIAL NOT NULL,
  "uuid" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  "prefix" TEXT NOT NULL,
  "code" INTEGER NOT NULL,
  "name" TEXT,
  CONSTRAINT "SolicitationCode_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "SolicitationCode_uuid_key" ON "SolicitationCode"("uuid");
-- CreateIndex
CREATE INDEX "SolicitationCode_uuid_idx" ON "SolicitationCode"("uuid");
-- CreateIndex
CREATE UNIQUE INDEX "SolicitationCode_prefix_code_key" ON "SolicitationCode"("prefix", "code");
-- CreateIndex
CREATE UNIQUE INDEX "DBFundsTeam_solicitationCodeId_marathonId_key" ON "DBFundsTeam"("solicitationCodeId", "marathonId");
-- AddForeignKey
ALTER TABLE "DBFundsTeam"
ADD CONSTRAINT "DBFundsTeam_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_enteredBy_fkey" FOREIGN KEY ("enteredBy") REFERENCES "Person"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_teamOverrideId_fkey" FOREIGN KEY ("teamOverrideId") REFERENCES "Team"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Team"
ADD CONSTRAINT "Team_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
INSERT INTO "SolicitationCode" ("uuid", "updatedAt", "prefix", "code")
SELECT gen_random_uuid(),
  CURRENT_TIMESTAMP,
  'DB',
  "dbNum"
FROM "DBFundsTeam"
WHERE "dbNum" IS NOT NULL;
ALTER TABLE "DBFundsTeam" DROP COLUMN "dbNum";
DROP VIEW "FundraisingEntryWithMeta";
CREATE VIEW "FundraisingEntryWithMeta" AS
SELECT fe.id,
  fe."uuid",
  fe."createdAt",
  fe."updatedAt",
  fe."teamOverrideId",
  COALESCE(
    -- Calculate unassigned using db_funds_team_entries if available
    (
      SELECT "dft"."amount"
      FROM "DBFundsFundraisingEntry" "dft"
        JOIN "FundraisingEntrySource" "fes" ON "dft"."id" = "fes"."dbFundsEntryId"
      WHERE "fes"."id" = "fe"."entrySourceId"
    ),
    -- Otherwise, use combinedAmount from DailyDepartmentNotification
    (
      SELECT "ddn"."combinedAmount"
      FROM "DailyDepartmentNotification" "ddn"
        JOIN "FundraisingEntrySource" "fes" ON "ddn"."id" = "fes"."ddnId"
      WHERE "fes"."id" = "fe"."entrySourceId"
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
  "fe"."enteredBy",
  "fe"."entrySourceId"
FROM "FundraisingEntry" "fe";