-- AlterEnum
ALTER TYPE "enum_people_committee_name" ADD VALUE 'overallCommittee';

-- DropIndex
DROP INDEX "committees_identifier";

-- RenameIndex
ALTER INDEX "committees_identifier_unique" RENAME TO "committees_identifier_key";
