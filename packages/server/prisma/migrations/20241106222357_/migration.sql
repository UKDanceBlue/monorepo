/*
 Warnings:
 
 - You are about to drop the column `fundraisingEntryWithMetaId` on the `DBFundsFundraisingEntry` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[dbFundsEntryId]` on the table `FundraisingEntrySource` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[ddnId]` on the table `FundraisingEntrySource` will be added. If there are existing duplicate values, this will fail.
 
 */
-- DropIndex
DROP INDEX "FundraisingEntrySource_entryId_dbFundsEntryId_key";
-- AlterTable
ALTER TABLE "DBFundsFundraisingEntry" DROP COLUMN "fundraisingEntryWithMetaId",
  ADD COLUMN "fundraisingEntryId" INTEGER;
-- AlterTable
ALTER TABLE "FundraisingEntry"
ALTER COLUMN "entrySourceId" DROP NOT NULL;
-- CreateIndex
CREATE UNIQUE INDEX "FundraisingEntrySource_dbFundsEntryId_key" ON "FundraisingEntrySource"("dbFundsEntryId");
-- CreateIndex
CREATE UNIQUE INDEX "FundraisingEntrySource_ddnId_key" ON "FundraisingEntrySource"("ddnId");
ALTER TABLE "FundraisingEntrySource"
ADD CONSTRAINT "FundraisingEntrySource_xor_source_id" CHECK (
    ("ddnId" IS NOT NULL) <> ("dbFundsEntryId" IS NOT NULL)
  );