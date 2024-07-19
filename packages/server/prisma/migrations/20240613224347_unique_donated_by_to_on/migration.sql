/*
  Warnings:

  - A unique constraint covering the columns `[donated_to,donated_by,date]` on the table `db_funds_team_entries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "db_funds_team_entries_donated_to_donated_by_date_key" ON "db_funds_team_entries"("donated_to", "donated_by", "date");
