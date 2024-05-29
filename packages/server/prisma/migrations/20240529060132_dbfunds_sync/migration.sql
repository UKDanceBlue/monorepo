/*
  Warnings:

  - A unique constraint covering the columns `[db_funds_team_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "db_funds_team_id" INTEGER;

-- CreateTable
CREATE TABLE "db_funds_teams" (
    "id" SERIAL NOT NULL,
    "db_num" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "db_funds_teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_funds_team_entries" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "donated_by" TEXT NOT NULL,
    "donated_to" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "team_db_num" INTEGER NOT NULL,

    CONSTRAINT "db_funds_team_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fundraising_entries" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "db_funds_entry_donated_by" TEXT,
    "db_funds_entry_date" TIMESTAMP(3),

    CONSTRAINT "fundraising_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fundraising_assignments" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "person_id" INTEGER NOT NULL,
    "fundraising_id" INTEGER NOT NULL,

    CONSTRAINT "fundraising_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "db_funds_teams_db_num_key" ON "db_funds_teams"("db_num");

-- CreateIndex
CREATE UNIQUE INDEX "db_funds_team_entries_donated_by_date_key" ON "db_funds_team_entries"("donated_by", "date");

-- CreateIndex
CREATE UNIQUE INDEX "fundraising_entries_uuid_unique" ON "fundraising_entries"("uuid");

-- CreateIndex
CREATE INDEX "fundraising_entries_uuid" ON "fundraising_entries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "fundraising_entries_db_funds_entry_donated_by_date_key" ON "fundraising_entries"("db_funds_entry_donated_by", "db_funds_entry_date");

-- CreateIndex
CREATE UNIQUE INDEX "fundraising_assignments_uuid_unique" ON "fundraising_assignments"("uuid");

-- CreateIndex
CREATE INDEX "fundraising_assignments_uuid" ON "fundraising_assignments"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "fundraising_assignments_fundraising_id_person_id_key" ON "fundraising_assignments"("fundraising_id", "person_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_db_funds_team_id_key" ON "teams"("db_funds_team_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_db_funds_team_id_fkey" FOREIGN KEY ("db_funds_team_id") REFERENCES "db_funds_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_funds_team_entries" ADD CONSTRAINT "db_funds_team_entries_team_db_num_fkey" FOREIGN KEY ("team_db_num") REFERENCES "db_funds_teams"("db_num") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fundraising_entries" ADD CONSTRAINT "fundraising_entries_db_funds_entry_donated_by_db_funds_ent_fkey" FOREIGN KEY ("db_funds_entry_donated_by", "db_funds_entry_date") REFERENCES "db_funds_team_entries"("donated_by", "date") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fundraising_assignments" ADD CONSTRAINT "fundraising_assignments_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fundraising_assignments" ADD CONSTRAINT "fundraising_assignments_fundraising_id_fkey" FOREIGN KEY ("fundraising_id") REFERENCES "fundraising_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
