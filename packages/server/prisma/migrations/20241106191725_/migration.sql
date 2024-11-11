/*
 Warnings:
 
 - The primary key for the `DailyDepartmentNotification` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `db_funds_entry_id` on the `fundraising_entries` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[id_sorter]` on the table `DailyDepartmentNotification` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[entry_source_id]` on the table `fundraising_entries` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `entry_source_id` to the `fundraising_entries` table without a default value. This is not possible if the table is not empty.
 - Added the required column `type` to the `fundraising_entries` table without a default value. This is not possible if the table is not empty.
 
 */
-- CreateEnum
CREATE TYPE "FundraisingEntryType" AS ENUM ('Cash', 'Check', 'Online', 'Legacy');
-- DropIndex
DROP INDEX "fundraising_entries_db_funds_entry_id_key";
-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_pkey",
  ADD COLUMN "id" SERIAL NOT NULL,
  ADD CONSTRAINT "DailyDepartmentNotification_pkey" PRIMARY KEY ("id");
-- AlterTable
ALTER TABLE "db_funds_team_entries"
ADD COLUMN "fundraisingEntryWithMetaId" INTEGER;
-- AlterTable
ALTER TABLE "fundraising_assignments"
ADD COLUMN "assigned_by" INTEGER;
-- AlterTable
ALTER TABLE "fundraising_entries"
ADD COLUMN "entered_by" INTEGER,
  ADD COLUMN "entry_source_id" INTEGER NOT NULL,
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "type" "FundraisingEntryType" NOT NULL;
-- CreateTable
CREATE TABLE "FundraisingEntrySource" (
  "id" SERIAL NOT NULL,
  "entry_id" INTEGER NOT NULL,
  "db_funds_entry_id" INTEGER,
  "ddn_id" INTEGER,
  CONSTRAINT "FundraisingEntrySource_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "FundraisingEntrySource_entry_id_key" ON "FundraisingEntrySource"("entry_id");
-- CreateIndex
CREATE UNIQUE INDEX "fundraising_entry_sources_entry_id_db_funds_entry_id_key" ON "FundraisingEntrySource"("entry_id", "db_funds_entry_id");
-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_id_sorter_key" ON "DailyDepartmentNotification"("id_sorter");
-- CreateIndex
CREATE UNIQUE INDEX "fundraising_entries_entry_source_id_key" ON "fundraising_entries"("entry_source_id");
-- AddForeignKey
ALTER TABLE "FundraisingEntrySource"
ADD CONSTRAINT "FundraisingEntrySource_db_funds_entry_id_fkey" FOREIGN KEY ("db_funds_entry_id") REFERENCES "db_funds_team_entries"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "FundraisingEntrySource"
ADD CONSTRAINT "FundraisingEntrySource_ddn_id_fkey" FOREIGN KEY ("ddn_id") REFERENCES "DailyDepartmentNotification"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "fundraising_assignments"
ADD CONSTRAINT "fundraising_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "people"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
INSERT INTO "FundraisingEntrySource" ("entry_id", "db_funds_entry_id", "ddn_id")
SELECT "id",
  "db_funds_entry_id",
  NULL
FROM "fundraising_entries";
DROP VIEW fundraising_entries_with_meta;
CREATE VIEW fundraising_entries_with_meta AS
SELECT fe.id,
  fe.uuid,
  fe.created_at,
  fe.updated_at,
  COALESCE(
    -- Calculate unassigned using db_funds_team_entries if available
    (
      SELECT dft.amount
      FROM db_funds_team_entries dft
        JOIN "FundraisingEntrySource" fes ON dft.id = fes.db_funds_entry_id
      WHERE fes.id = fe.entry_source_id
    ),
    -- Otherwise, use combinedAmount from DailyDepartmentNotification
    (
      SELECT ddn.combined_amount
      FROM "DailyDepartmentNotification" ddn
        JOIN "FundraisingEntrySource" fes ON ddn.id = fes.ddn_id
      WHERE fes.id = fe.entry_source_id
    )
  ) - COALESCE(
    (
      SELECT SUM(assignment.amount)
      FROM fundraising_assignments assignment
      WHERE assignment.fundraising_id = fe.id
    ),
    0::numeric(65, 30)
  ) AS unassigned,
  fe.notes,
  fe.type,
  fe.entered_by,
  fe.entry_source_id
FROM fundraising_entries fe;
ALTER TABLE "fundraising_entries" DROP COLUMN "db_funds_entry_id";