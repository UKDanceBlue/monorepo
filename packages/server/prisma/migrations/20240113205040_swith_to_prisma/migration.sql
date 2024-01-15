/*
Warnings:

- You are about to drop the column `deleted_at` on the `devices` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `event_occurrences` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `events` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `images` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `memberships` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `people` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `point_entries` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `point_opportunities` table. All the data in the column will be lost.
- You are about to drop the column `deleted_at` on the `teams` table. All the data in the column will be lost.
- You are about to drop the `sequelize_meta` table. If the table is not empty, all the data it contains will be lost.
- Made the column `created_at` on table `event_occurrences` required. This step will fail if there are existing NULL values in that column.
- Made the column `updated_at` on table `event_occurrences` required. This step will fail if there are existing NULL values in that column.

 */
-- AlterTable
ALTER TABLE "configurations"
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DELETE FROM "devices"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "devices"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "event_images"
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DELETE FROM "event_occurrences"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "event_occurrences"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET
  NOT NULL,
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at"
SET
  NOT NULL,
ALTER COLUMN "full_day"
SET DEFAULT false;

-- AlterTable
DELETE FROM "events"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "events"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "images"
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "images"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "login_flow_sessions"
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DELETE FROM "memberships"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "memberships"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DELETE FROM "people"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "people"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DELETE FROM "point_entries"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "point_entries"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DELETE FROM "point_opportunities"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "point_opportunities"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
DELETE FROM "teams"
WHERE
  "deleted_at" IS NOT NULL;

ALTER TABLE "teams"
DROP COLUMN "deleted_at",
ALTER COLUMN "created_at"
SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "sequelize_meta";

-- CreateIndex
CREATE INDEX "event_occurrences_uuid" ON "event_occurrences" ("uuid");

-- CreateIndex
CREATE INDEX "events_uuid" ON "events" ("uuid");

-- CreateIndex
CREATE INDEX "login_flow_sessions_uuid" ON "login_flow_sessions" ("uuid");

-- CreateIndex
CREATE INDEX "memberships_uuid" ON "memberships" ("uuid");

-- CreateIndex
CREATE INDEX "people_uuid" ON "people" ("uuid");

-- CreateIndex
CREATE INDEX "point_entries_uuid" ON "point_entries" ("uuid");

-- CreateIndex
CREATE INDEX "point_opportunities_uuid" ON "point_opportunities" ("uuid");

-- CreateIndex
CREATE INDEX "teams_uuid" ON "teams" ("uuid");