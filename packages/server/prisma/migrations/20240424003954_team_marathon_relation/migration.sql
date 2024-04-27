/*
  Warnings:

  - You are about to drop the column `marathon_year` on the `teams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[marathon_id,persistent_identifier]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marathon_id` to the `teams` table without a default value. This is not possible if the table is not empty.

*/



-- AlterTable
ALTER TABLE "teams" ADD COLUMN "marathon_id" INTEGER;

UPDATE "teams" SET "marathon_id" = (
  SELECT "id"
  FROM "marathons"
  WHERE "year" = 'DB24'
) WHERE "marathon_year" = 'DB24';

ALTER TABLE "teams" ALTER COLUMN "marathon_id" SET NOT NULL;

-- Replace the view
DROP VIEW "teams_with_total_points";


-- DropColumn
ALTER TABLE "teams" DROP COLUMN "marathon_year";

create view teams_with_total_points
            (id, uuid, name, type, legacyStatus, persistentIdentifier, marathonId, createdAt, updatedAt,
             totalPoints) as
SELECT teams.id,
       teams.uuid,
       teams.name,
       teams.type,
       teams.legacy_status                     AS legacyStatus,
       teams.persistent_identifier             AS persistentIdentifier,
       teams.marathon_id                       AS marathonId,
       teams.created_at                        AS createdAt,
       teams.updated_at                        AS updatedAt,
       COALESCE(points.totalPoints, 0::bigint) AS totalPoints
FROM teams
         LEFT JOIN (SELECT sum(entry.points) AS totalPoints,
                           entry.team_id
                    FROM point_entries entry
                    GROUP BY entry.team_id) points ON teams.id = points.team_id;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_marathon_id_fkey" FOREIGN KEY ("marathon_id") REFERENCES "marathons"("id") ON DELETE CASCADE ON UPDATE CASCADE, DROP CONSTRAINT "teams_persistent_identifier_unique";

-- CreateIndex
CREATE UNIQUE INDEX "teams_marathon_id_persistent_identifier_key" ON "teams"("marathon_id", "persistent_identifier");