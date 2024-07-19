/*
  Warnings:

  - You are about to drop the column `db_funds_entry_date` on the `fundraising_entries` table. All the data in the column will be lost.
  - You are about to drop the column `db_funds_entry_donated_by` on the `fundraising_entries` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `fundraising_entries` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[db_funds_entry_id]` on the table `fundraising_entries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "fundraising_entries" DROP CONSTRAINT "fundraising_entries_db_funds_entry_donated_by_db_funds_ent_fkey";

-- DropIndex
DROP INDEX "db_funds_team_entries_donated_by_date_key";

-- DropIndex
DROP INDEX "fundraising_entries_db_funds_entry_donated_by_date_key";

-- AlterTable
ALTER TABLE "fundraising_entries" DROP COLUMN "db_funds_entry_date",
DROP COLUMN "db_funds_entry_donated_by",
DROP COLUMN "total_amount",
ADD COLUMN     "db_funds_entry_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "fundraising_entries_db_funds_entry_id_key" ON "fundraising_entries"("db_funds_entry_id");

-- AddForeignKey
ALTER TABLE "fundraising_entries" ADD CONSTRAINT "fundraising_entries_db_funds_entry_id_fkey" FOREIGN KEY ("db_funds_entry_id") REFERENCES "db_funds_team_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
