/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `db_funds_team_entries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `db_funds_teams` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `db_funds_team_entries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `db_funds_teams` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "db_funds_team_entries" ADD COLUMN     "uuid" UUID;

-- AlterTable
ALTER TABLE "db_funds_teams" ADD COLUMN     "uuid" UUID;

-- Add a random UUID to all existing rows
UPDATE "db_funds_team_entries" SET "uuid" = gen_random_uuid();
UPDATE "db_funds_teams" SET "uuid" = gen_random_uuid();

-- Make the column required

-- AlterTable
ALTER TABLE "db_funds_team_entries" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "db_funds_teams" ALTER COLUMN "uuid" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "db_funds_team_entries_uuid_key" ON "db_funds_team_entries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "db_funds_teams_uuid_key" ON "db_funds_teams"("uuid");
