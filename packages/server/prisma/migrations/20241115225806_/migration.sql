/*
 Warnings:
 
 - Added the required column `solicitationCodeId` to the `DailyDepartmentNotification` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropForeignKey
ALTER TABLE "DBFundsFundraisingEntry" DROP CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry";

-- DropForeignKey
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_fundraisingEntry";

-- DropForeignKey
ALTER TABLE "FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_teamOverrideId_fkey";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ADD COLUMN "solicitationCodeId" INTEGER;

UPDATE "DailyDepartmentNotification"
SET "solicitationCodeId" = "FundraisingEntry"."solicitationCodeId"
FROM "FundraisingEntry"
WHERE "DailyDepartmentNotification"."fundraisingEntryId" = "FundraisingEntry"."id";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ALTER COLUMN "solicitationCodeId"
SET NOT NULL;

-- AlterTable
ALTER TABLE "FundraisingEntry"
ALTER COLUMN "solicitationCodeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DBFundsFundraisingEntry"
ADD CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE
SET NULL ON UPDATE CASCADE;