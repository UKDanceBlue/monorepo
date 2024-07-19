/*
  Warnings:

  - A unique constraint covering the columns `[db_num,marathon_id]` on the table `db_funds_teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "db_funds_team_entries" DROP CONSTRAINT "db_funds_team_entries_team_db_num_fkey";

-- DropIndex
DROP INDEX "db_funds_teams_db_num_key";

-- AlterTable
ALTER TABLE "db_funds_teams" ADD COLUMN     "marathon_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "db_funds_teams_db_num_marathon_id_key" ON "db_funds_teams"("db_num", "marathon_id");

-- AddForeignKey
ALTER TABLE "db_funds_teams" ADD CONSTRAINT "db_funds_teams_marathon_id_fkey" FOREIGN KEY ("marathon_id") REFERENCES "marathons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_funds_team_entries" ADD CONSTRAINT "db_funds_team_entries_team_db_num_fkey" FOREIGN KEY ("team_db_num") REFERENCES "db_funds_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
