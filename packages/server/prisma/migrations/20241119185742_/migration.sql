/*
 Warnings:
 
 - The primary key for the `DailyDepartmentNotificationBatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `batchType` on the `DailyDepartmentNotificationBatch` table. All the data in the column will be lost.
 - You are about to drop the column `teamOverrideId` on the `FundraisingEntry` table. All the data in the column will be lost.
 - You are about to drop the column `type` on the `FundraisingEntry` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[uuid]` on the table `DailyDepartmentNotification` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[uuid]` on the table `DailyDepartmentNotificationBatch` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[batchId]` on the table `DailyDepartmentNotificationBatch` will be added. If there are existing duplicate values, this will fail.
 - The required column `uuid` was added to the `DailyDepartmentNotification` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
 - The required column `uuid` was added to the `DailyDepartmentNotificationBatch` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
 
 */
-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ADD COLUMN "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "DailyDepartmentNotificationBatch" DROP CONSTRAINT "DailyDepartmentNotificationBatch_pkey" CASCADE,
  DROP COLUMN "batchType",
  ADD COLUMN "id" SERIAL NOT NULL,
  ADD COLUMN "uuid" UUID NOT NULL,
  ADD CONSTRAINT "DailyDepartmentNotificationBatch_pkey" PRIMARY KEY ("id");

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
  "fe"."enteredByPersonId",
  "fe"."solicitationCodeId"
FROM "FundraisingEntry" "fe";

-- AlterTable
ALTER TABLE "FundraisingEntry" DROP COLUMN "teamOverrideId",
  DROP COLUMN "type";

-- DropEnum
DROP TYPE "BatchType";

-- DropEnum
DROP TYPE "FundraisingEntryType";

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_uuid_key" ON "DailyDepartmentNotification"("uuid");

-- CreateIndex
CREATE INDEX "DailyDepartmentNotification_uuid_idx" ON "DailyDepartmentNotification"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotificationBatch_uuid_key" ON "DailyDepartmentNotificationBatch"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotificationBatch_batchId_key" ON "DailyDepartmentNotificationBatch"("batchId");

-- CreateIndex
CREATE INDEX "DailyDepartmentNotificationBatch_uuid_idx" ON "DailyDepartmentNotificationBatch"("uuid");