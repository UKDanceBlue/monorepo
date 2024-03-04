/*
  Warnings:

  - A unique constraint covering the columns `[person_id,team_id]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.

*/

-- Deduplicate memberships
DELETE FROM "memberships" WHERE "id" NOT IN (SELECT MAX("id") FROM "memberships" GROUP BY "person_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_person_id_team_id_key" ON "memberships"("person_id", "team_id");
