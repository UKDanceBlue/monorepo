/*
  Warnings:

  - You are about to drop the column `donorHash` on the `DailyDepartmentNotification` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idSorter,processDate,batchId,solicitationCodeId,combinedAmount,donorSummary]` on the table `DailyDepartmentNotification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `donorSummary` to the `DailyDepartmentNotification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP COLUMN "donorHash",
ADD COLUMN     "donorSummary" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key" ON "DailyDepartmentNotification"("idSorter", "processDate", "batchId", "solicitationCodeId", "combinedAmount", "donorSummary");
