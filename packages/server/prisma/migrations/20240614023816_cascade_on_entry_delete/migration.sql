/*
  Warnings:

  - Made the column `db_funds_entry_id` on table `fundraising_entries` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "fundraising_assignments" DROP CONSTRAINT "fundraising_assignments_fundraising_id_fkey";

-- DropForeignKey
ALTER TABLE "fundraising_assignments" DROP CONSTRAINT "fundraising_assignments_person_id_fkey";

-- DropForeignKey
ALTER TABLE "fundraising_entries" DROP CONSTRAINT "fundraising_entries_db_funds_entry_id_fkey";

-- AlterTable
ALTER TABLE "fundraising_entries" ALTER COLUMN "db_funds_entry_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "fundraising_entries" ADD CONSTRAINT "fundraising_entries_db_funds_entry_id_fkey" FOREIGN KEY ("db_funds_entry_id") REFERENCES "db_funds_team_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fundraising_assignments" ADD CONSTRAINT "fundraising_assignments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fundraising_assignments" ADD CONSTRAINT "fundraising_assignments_fundraising_id_fkey" FOREIGN KEY ("fundraising_id") REFERENCES "fundraising_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
