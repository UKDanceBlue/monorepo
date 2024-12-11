/*
 Warnings:
 
 - The values [Committee] on the enum `TeamType` will be removed. If these variants are still used in the database, this will fail.
 
 */
BEGIN;

DROP VIEW "TeamsWithTotalPoints";

UPDATE "Team"
SET "type" = 'Spirit'
WHERE "type" = 'Committee';

CREATE TYPE "TeamType_new" AS ENUM ('Spirit', 'Morale', 'Mini');

ALTER TABLE "Team"
ALTER COLUMN "type" TYPE "TeamType_new" USING ("type"::text::"TeamType_new");

ALTER TYPE "TeamType"
RENAME TO "TeamType_old";

ALTER TYPE "TeamType_new"
RENAME TO "TeamType";

DROP TYPE "TeamType_old";

CREATE VIEW "TeamsWithTotalPoints" (
  "id",
  "uuid",
  "name",
  "type",
  "legacyStatus",
  "persistentIdentifier",
  "marathonId",
  "createdAt",
  "updatedAt",
  "totalPoints"
) AS
SELECT "Team"."id",
  "Team"."uuid",
  "Team"."name",
  "Team"."type",
  "Team"."legacyStatus",
  "Team"."persistentIdentifier",
  "Team"."marathonId",
  "Team"."createdAt",
  "Team"."updatedAt",
  COALESCE("points"."totalPoints", 0::bigint) AS "totalPoints"
FROM "Team"
  LEFT JOIN (
    SELECT sum("entry"."points") AS "totalPoints",
      "entry"."teamId"
    FROM "PointEntry" "entry"
    GROUP BY "entry"."teamId"
  ) "points" ON "Team"."id" = "points"."teamId";

COMMIT;