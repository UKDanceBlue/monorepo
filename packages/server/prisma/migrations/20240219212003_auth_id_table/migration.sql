/*
  Warnings:

  - You are about to drop the column `auth_ids` on the `people` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthSource" AS ENUM ('LinkBlue', 'Anonymous', 'Demo');

-- CreateTable
CREATE TABLE "auth_id_pairs" (
    "id" SERIAL NOT NULL,
    "source" "AuthSource" NOT NULL,
    "value" TEXT NOT NULL,
    "person_id" INTEGER NOT NULL,

    CONSTRAINT "auth_id_pairs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auth_id_pairs" ADD CONSTRAINT "auth_id_pairs_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Copy the data from the old column (JSON of form Record<"UkyLinkblue" | "Anonymous" | "Demo" | "None", string>) to the new table, dropping keys of "None"
INSERT INTO "auth_id_pairs" ("source", "value", "person_id")
SELECT
  CASE
    WHEN "auth_ids"->>'UkyLinkblue' IS NOT NULL THEN 'LinkBlue'
    WHEN "auth_ids"->>'Anonymous' IS NOT NULL THEN 'Anonymous'
    WHEN "auth_ids"->>'Demo' IS NOT NULL THEN 'Demo'
  END::"AuthSource",
  CASE
    WHEN "auth_ids"->>'UkyLinkblue' IS NOT NULL THEN "auth_ids"->>'UkyLinkblue'
    WHEN "auth_ids"->>'Anonymous' IS NOT NULL THEN "auth_ids"->>'Anonymous'
    WHEN "auth_ids"->>'Demo' IS NOT NULL THEN "auth_ids"->>'Demo'
  END,
  "id"
  FROM "people"
  WHERE "auth_ids" != '{}'::jsonb;

-- AlterTable
ALTER TABLE "people" DROP COLUMN "auth_ids";
