/*
 Warnings:
 
 - You are about to drop the column `businessPhone` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `businessPhoneRestriction` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Amount` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Constituency` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Deceased` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Degrees` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1GiftKey` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Id` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Name` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Pm` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1Relation` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor1TitleBar` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Amount` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Constituency` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Deceased` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Degrees` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2GiftKey` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Id` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Name` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Pm` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2Relation` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `donor2TitleBar` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `email` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `emailRestriction` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `homePhone` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `homePhoneRestriction` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `pCity` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `pLine1` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `pLine2` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `pLine3` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `pState` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 - You are about to drop the column `pZip` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
 
 */
DELETE FROM "DailyDepartmentNotification"
WHERE 1 = 1;

-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP COLUMN "businessPhone",
  DROP COLUMN "businessPhoneRestriction",
  DROP COLUMN "donor1Amount",
  DROP COLUMN "donor1Constituency",
  DROP COLUMN "donor1Deceased",
  DROP COLUMN "donor1Degrees",
  DROP COLUMN "donor1GiftKey",
  DROP COLUMN "donor1Id",
  DROP COLUMN "donor1Name",
  DROP COLUMN "donor1Pm",
  DROP COLUMN "donor1Relation",
  DROP COLUMN "donor1TitleBar",
  DROP COLUMN "donor2Amount",
  DROP COLUMN "donor2Constituency",
  DROP COLUMN "donor2Deceased",
  DROP COLUMN "donor2Degrees",
  DROP COLUMN "donor2GiftKey",
  DROP COLUMN "donor2Id",
  DROP COLUMN "donor2Name",
  DROP COLUMN "donor2Pm",
  DROP COLUMN "donor2Relation",
  DROP COLUMN "donor2TitleBar",
  DROP COLUMN "email",
  DROP COLUMN "emailRestriction",
  DROP COLUMN "homePhone",
  DROP COLUMN "homePhoneRestriction",
  DROP COLUMN "pCity",
  DROP COLUMN "pLine1",
  DROP COLUMN "pLine2",
  DROP COLUMN "pLine3",
  DROP COLUMN "pState",
  DROP COLUMN "pZip";

-- CreateTable
CREATE TABLE "DDNDonor" (
  "id" SERIAL NOT NULL,
  "uuid" UUID NOT NULL,
  "donorId" TEXT NOT NULL,
  "giftKey" TEXT,
  "name" TEXT,
  "deceased" BOOLEAN NOT NULL,
  "constituency" TEXT,
  "titleBar" TEXT,
  "pm" TEXT,
  "degrees" TEXT [],
  "emails" TEXT [],
  CONSTRAINT "DDNDonor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DDNDonorLink" (
  "donorId" INTEGER NOT NULL,
  "ddnId" INTEGER NOT NULL,
  "amount" DECIMAL(65, 30) NOT NULL,
  "relation" TEXT,
  CONSTRAINT "DDNDonorLink_pkey" PRIMARY KEY ("donorId", "ddnId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DDNDonor_uuid_key" ON "DDNDonor"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "DDNDonor_donorId_key" ON "DDNDonor"("donorId");

-- CreateIndex
CREATE INDEX "DDNDonor_uuid_idx" ON "DDNDonor"("uuid");

-- AddForeignKey
ALTER TABLE "DDNDonorLink"
ADD CONSTRAINT "DDNDonorLink_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "DDNDonor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DDNDonorLink"
ADD CONSTRAINT "DDNDonorLink_ddnId_fkey" FOREIGN KEY ("ddnId") REFERENCES "DailyDepartmentNotification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;