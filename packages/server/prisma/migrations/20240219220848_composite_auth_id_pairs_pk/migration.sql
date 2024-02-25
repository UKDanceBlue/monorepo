/*
  Warnings:

  - The primary key for the `auth_id_pairs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `auth_id_pairs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "auth_id_pairs" DROP CONSTRAINT "auth_id_pairs_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "auth_id_pairs_pkey" PRIMARY KEY ("person_id", "source");

-- AlterTable
ALTER TABLE "event_occurrences" ALTER COLUMN "updated_at" DROP DEFAULT;
