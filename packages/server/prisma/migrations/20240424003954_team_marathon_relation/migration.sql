/*
  Warnings:

  - You are about to drop the column `marathon_year` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marathon_id,persistent_identifier]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marathon_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/



-- AlterTable
ALTER TABLE "teams" ADD COLUMN "marathon_id" INTEGER;

WITH Db24Id AS (
  SELECT "id"
  FROM "marathons"
  WHERE "year" = "DB24"
) UPDATE "teams" SET "marathon_id" = Db24Id."id" WHERE "marathon_year" = "DB24";

ALTER TABLE "teams" ALTER COLUMN "marathon_id" SET NOT NULL;

-- DropColumn
ALTER TABLE "teams" DROP COLUMN "marathon_year";

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_marathon_id_fkey" FOREIGN KEY ("marathon_id") REFERENCES "marathons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "teams_persistent_identifier_unique";

-- CreateIndex
CREATE UNIQUE INDEX "teams_marathon_id_persistent_identifier_key" ON "teams"("marathon_id", "persistent_identifier");