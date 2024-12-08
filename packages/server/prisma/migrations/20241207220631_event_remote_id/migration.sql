/*
  Warnings:

  - A unique constraint covering the columns `[remoteId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "remoteId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_remoteId_key" ON "Event"("remoteId");
