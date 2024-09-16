/*
  Warnings:

  - A unique constraint covering the columns `[marathon_id,committee_id]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "teams_persistent_identifier_unique";
-- ALTER TABLE "teams" DROP CONSTRAINT IF EXISTS "teams_persistent_identifier_unique";

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "committee_id" INTEGER;

-- CreateTable
CREATE TABLE "committees" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "identifier" "enum_people_committee_name" NOT NULL,
    "parent_committee_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "committees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "committees_uuid_unique" ON "committees"("uuid");
CREATE UNIQUE INDEX "committees_identifier_unique" ON "committees"("identifier");

-- CreateIndex
CREATE INDEX "committees_uuid" ON "committees"("uuid");
CREATE INDEX "committees_identifier" ON "committees"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "teams_marathon_id_committee_id_key" ON "teams"("marathon_id", "committee_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committees" ADD CONSTRAINT "committees_parent_committee_id_fkey" FOREIGN KEY ("parent_committee_id") REFERENCES "committees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
