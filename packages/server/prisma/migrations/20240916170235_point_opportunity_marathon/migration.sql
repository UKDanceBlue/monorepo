/*
  Warnings:

  - Added the required column `marathon_id` to the `point_opportunities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fundraising_assignments" DROP CONSTRAINT "fundraising_assignments_fundraising_id_fkey";

-- DropForeignKey
ALTER TABLE "fundraising_entries" DROP CONSTRAINT "fundraising_entries_db_funds_entry_id_fkey";

-- AlterTable
ALTER TABLE "point_opportunities" ADD COLUMN     "marathon_id" INTEGER;

-- Fill the new column with the default value (marathon where year is DB24)
UPDATE "point_opportunities" SET "marathon_id" = (SELECT "id" FROM "marathons" WHERE "year" = 'DB24');

-- AlterColumn
ALTER TABLE "point_opportunities" ALTER COLUMN "marathon_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "point_opportunities" ADD CONSTRAINT "point_opportunities_marathon_id_fkey" FOREIGN KEY ("marathon_id") REFERENCES "marathons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
