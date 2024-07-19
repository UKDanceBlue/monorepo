-- DropForeignKey
ALTER TABLE "db_funds_team_entries" DROP CONSTRAINT "db_funds_team_entries_team_db_num_fkey";

-- AlterTable
ALTER TABLE "db_funds_team_entries" ALTER COLUMN "donated_to" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "db_funds_team_entries" ADD CONSTRAINT "db_funds_team_entries_team_db_num_fkey" FOREIGN KEY ("team_db_num") REFERENCES "db_funds_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
