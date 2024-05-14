/*
  Warnings:

  - You are about to drop the column `committee_name` on the `people` table. All the data in the column will be lost.
  - You are about to drop the column `committee_role` on the `people` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "memberships" ADD COLUMN     "committee_role" "enum_people_committee_role";

-- AlterTable
ALTER TABLE "people" DROP COLUMN "committee_name",
DROP COLUMN "committee_role";
