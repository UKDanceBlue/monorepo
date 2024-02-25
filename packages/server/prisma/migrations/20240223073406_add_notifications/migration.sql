-- CreateEnum
CREATE TYPE "NotificationError" AS ENUM ('DeviceNotRegistered', 'InvalidCredentials', 'MessageTooBig', 'MessageRateExceeded', 'MismatchSenderId');

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "verifier" TEXT;

-- AlterTable
ALTER TABLE "teams" ALTER COLUMN "marathon_year" SET DATA TYPE CHAR(4);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "url" TEXT,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "delivery_issue" TEXT,
    "delivery_issue_acknowledged_at" TIMESTAMPTZ(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_deliveries" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "device_id" INTEGER NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "receipt_id" TEXT,
    "delivered" BOOLEAN,
    "delivery_error" "NotificationError",
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notifications_uuid_unique" ON "notifications"("uuid");

-- CreateIndex
CREATE INDEX "notifications_uuid" ON "notifications"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "notification_deliveries_uuid_unique" ON "notification_deliveries"("uuid");

-- CreateIndex
CREATE INDEX "notification_deliveries_uuid" ON "notification_deliveries"("uuid");

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
