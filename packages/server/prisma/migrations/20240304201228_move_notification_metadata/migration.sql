/*
  Warnings:

  - You are about to drop the column `delivered` on the `notification_deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `sent` on the `notifications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receipt_id]` on the table `notification_deliveries` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "notification_deliveries" DROP COLUMN "delivered",
ADD COLUMN     "chunk_uuid" UUID,
ADD COLUMN     "delivered_by" TIMESTAMPTZ(6),
ADD COLUMN     "sent_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "sent";

-- CreateIndex
CREATE UNIQUE INDEX "notification_deliveries_receipt_id_key" ON "notification_deliveries"("receipt_id");
