/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `point_entries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "memberships_uuid_unique" ON "memberships"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "point_entries_uuid_unique" ON "point_entries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "teams_uuid_unique" ON "teams"("uuid");
