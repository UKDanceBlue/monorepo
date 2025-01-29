/*
  Warnings:

  - You are about to drop the column `giftKey` on the `DDNDonor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idSorter,processDate,batchId,solicitationCodeId,combinedAmount,donorHash]` on the table `DailyDepartmentNotification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `donorHash` to the `DailyDepartmentNotification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key";

-- AlterTable
ALTER TABLE "DDNDonor" DROP COLUMN "giftKey";

-- AlterTable
ALTER TABLE "DDNDonorLink" ADD COLUMN     "giftKey" TEXT;

-- AlterTable
ALTER TABLE "DailyDepartmentNotification" ADD COLUMN     "donorHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key" ON "DailyDepartmentNotification"("idSorter", "processDate", "batchId", "solicitationCodeId", "combinedAmount", "donorHash");
