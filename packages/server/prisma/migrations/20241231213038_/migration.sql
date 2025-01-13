/*
 Warnings:
 
 - The primary key for the `AuthIdPair` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to alter the column `amount` on the `FundraisingAssignment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.
 - You are about to drop the column `solicitationCodeId` on the `FundraisingEntry` table. All the data in the column will be lost.
 - You are about to alter the column `amountOverride` on the `FundraisingEntry` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(65,2)`.
 - A unique constraint covering the columns `[personId,fundraisingId]` on the table `FundraisingAssignment` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[persistentIdentifier]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[correspondingCommitteeId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
 - Made the column `pointOpportunityId` on table `PointEntry` required. This step will fail if there are existing NULL values in that column.
 
 */
DROP VIEW "danceblue"."FundraisingEntryWithMeta";

-- DropForeignKey
ALTER TABLE "FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_fileId_fkey";

-- DropForeignKey
ALTER TABLE "PointEntry" DROP CONSTRAINT "PointEntry_pointOpportunityId_fkey";

-- DropForeignKey
ALTER TABLE "PointOpportunity" DROP CONSTRAINT "PointOpportunity_marathonId_fkey";

-- DropIndex
DROP INDEX "Committee_uuid_idx";

-- DropIndex
DROP INDEX "Configuration_uuid_idx";

-- DropIndex
DROP INDEX "DDNDonor_uuid_idx";

-- DropIndex
DROP INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key";

-- DropIndex
DROP INDEX "DailyDepartmentNotification_uuid_idx";

-- DropIndex
DROP INDEX "DailyDepartmentNotificationBatch_uuid_idx";

-- DropIndex
DROP INDEX "Device_uuid_idx";

-- DropIndex
DROP INDEX "Event_uuid_idx";

-- DropIndex
DROP INDEX "EventOccurrence_uuid_idx";

-- DropIndex
DROP INDEX "FeedItem_uuid_idx";

-- DropIndex
DROP INDEX "File_uuid_idx";

-- DropIndex
DROP INDEX "FundraisingAssignment_fundraisingId_personId_key";

-- DropIndex
DROP INDEX "FundraisingAssignment_uuid_idx";

-- DropIndex
DROP INDEX "FundraisingEntry_uuid_idx";

-- DropIndex
DROP INDEX "Image_uuid_idx";

-- DropIndex
DROP INDEX "LoginFlowSession_uuid_idx";

-- DropIndex
DROP INDEX "Marathon_uuid_idx";

-- DropIndex
DROP INDEX "Membership_uuid_idx";

-- DropIndex
DROP INDEX "Notification_uuid_idx";

-- DropIndex
DROP INDEX "NotificationDelivery_uuid_idx";

-- DropIndex
DROP INDEX "Person_uuid_idx";

-- DropIndex
DROP INDEX "PointEntry_uuid_idx";

-- DropIndex
DROP INDEX "PointOpportunity_uuid_idx";

-- DropIndex
DROP INDEX "SolicitationCode_uuid_idx";

-- DropIndex
DROP INDEX "Team_marathonId_correspondingCommitteeId_key";

-- DropIndex
DROP INDEX "Team_marathonId_persistentIdentifier_key";

-- DropIndex
DROP INDEX "Team_uuid_idx";

-- AlterTable
ALTER TABLE "AuditLog"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "AuthIdPair" DROP CONSTRAINT "AuthIdPair_pkey",
  ADD CONSTRAINT "AuthIdPair_pkey" PRIMARY KEY ("source", "personId");

-- AlterTable
ALTER TABLE "Committee"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Configuration"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "DBFundsFundraisingEntry"
ADD COLUMN "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "DBFundsTeam"
ADD COLUMN "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "DDNDonor"
ADD COLUMN "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "DDNDonorLink"
ADD COLUMN "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ADD COLUMN "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "DailyDepartmentNotificationBatch"
ADD COLUMN "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Device"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Event"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "EventOccurrence"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FeedItem"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "File"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "FundraisingAssignment"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "amount"
SET DATA TYPE DECIMAL(65, 2);

-- AlterTable
ALTER TABLE "FundraisingEntry" DROP COLUMN "solicitationCodeId",
  ADD COLUMN "solicitationCodeOverrideId" INTEGER,
  ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "amountOverride"
SET DATA TYPE DECIMAL(65, 2);

-- AlterTable
ALTER TABLE "Image"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "LoginFlowSession"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Marathon"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MarathonHour"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "MarathonHourMapImage"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Membership"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Notification"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "NotificationDelivery"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Person"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "PointEntry"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "pointOpportunityId"
SET NOT NULL;

-- AlterTable
ALTER TABLE "PointOpportunity"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "SolicitationCode"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "Team"
ALTER COLUMN "uuid"
SET DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "FundraisingAssignment_personId_fundraisingId_key" ON "FundraisingAssignment"("personId", "fundraisingId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_persistentIdentifier_key" ON "Team"("persistentIdentifier");

-- AddForeignKey
ALTER TABLE "Image"
ADD CONSTRAINT "Image_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_solicitationCodeOverrideId_fkey" FOREIGN KEY ("solicitationCodeOverrideId") REFERENCES "SolicitationCode"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointEntry"
ADD CONSTRAINT "PointEntry_pointOpportunityId_fkey" FOREIGN KEY ("pointOpportunityId") REFERENCES "PointOpportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointOpportunity"
ADD CONSTRAINT "PointOpportunity_marathonId_fkey" FOREIGN KEY ("marathonId") REFERENCES "Marathon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE FUNCTION format_solicitation_code(text, integer, text) RETURNS text AS $$
SELECT format(
    '%s%4s%s',
    $1,
    to_char(
      $2,
      'fmfm9999999999999999999999999999999999999999999999990000'
    ),
    NULLIF(FORMAT(' - %s', $3), ' - ')
  );

$$ LANGUAGE SQL immutable;

--> statement-breakpoint
ALTER TABLE "danceblue"."SolicitationCode"
ADD COLUMN "text" text GENERATED ALWAYS AS (format_solicitation_code(prefix, code, name)) STORED;

--> statement-breakpoint
CREATE VIEW "danceblue"."FundraisingEntryWithMeta" AS (
  SELECT "danceblue"."FundraisingEntry"."id",
    "danceblue"."FundraisingEntry"."uuid",
    "danceblue"."FundraisingEntry"."createdAt",
    "danceblue"."FundraisingEntry"."updatedAt",
    COALESCE(
      "danceblue"."FundraisingEntry"."amountOverride",
      "danceblue"."DBFundsFundraisingEntry"."amount",
      "danceblue"."DailyDepartmentNotification"."combinedAmount"
    ) - COALESCE(
      (
        SELECT sum("amount")
        FROM "danceblue"."FundraisingAssignment"
        WHERE "danceblue"."FundraisingAssignment"."fundraisingId" = "danceblue"."FundraisingEntry"."id"
      ),
      0::numeric(65, 30)
    ) AS "unassigned",
    COALESCE(
      "danceblue"."FundraisingEntry"."amountOverride",
      "danceblue"."DBFundsFundraisingEntry"."amount",
      "danceblue"."DailyDepartmentNotification"."combinedAmount"
    ) AS "amount",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedToOverride",
      "danceblue"."DBFundsFundraisingEntry"."donatedTo",
      "danceblue"."DailyDepartmentNotification"."comment"
    ) AS "donatedTo",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedByOverride",
      "danceblue"."DBFundsFundraisingEntry"."donatedBy",
      "danceblue"."DailyDepartmentNotification"."combinedDonorName"
    ) AS "donatedBy",
    COALESCE(
      "danceblue"."FundraisingEntry"."donatedOnOverride"::timestamp without time zone,
      "danceblue"."DBFundsFundraisingEntry"."date",
      "danceblue"."DailyDepartmentNotification"."transactionDate"::timestamp without time zone
    ) AS "donatedOn",
    "danceblue"."FundraisingEntry"."notes",
    "danceblue"."FundraisingEntry"."enteredByPersonId",
    "danceblue"."FundraisingEntry"."solicitationCodeOverrideId",
    "danceblue"."FundraisingEntry"."batchTypeOverride",
    "danceblue"."FundraisingEntry"."donatedByOverride",
    "danceblue"."FundraisingEntry"."donatedOnOverride",
    "danceblue"."FundraisingEntry"."donatedToOverride",
    "danceblue"."FundraisingEntry"."amountOverride",
    "danceblue"."SolicitationCode"."text",
    "danceblue"."SolicitationCode"."id" AS "solicitationCodeId",
    CASE
      WHEN "danceblue"."FundraisingEntry"."batchTypeOverride" IS NOT NULL THEN "danceblue"."FundraisingEntry"."batchTypeOverride"
      WHEN "danceblue"."DailyDepartmentNotification"."id" IS NULL THEN 'DBFunds'::"BatchType"
      WHEN "danceblue"."DailyDepartmentNotificationBatch"."id" IS NULL THEN NULL::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'C'::text THEN 'Check'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'T'::text THEN 'Transmittal'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'D'::text THEN 'CreditCard'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'A'::text THEN 'ACH'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'N'::text THEN 'NonCash'::"BatchType"
      WHEN "left"(
        "right"(
          "danceblue"."DailyDepartmentNotificationBatch"."batchId",
          2
        ),
        1
      ) = 'X'::text THEN 'PayrollDeduction'::"BatchType"
      ELSE 'Unknown'::"BatchType"
    END AS "batchType"
  FROM "danceblue"."FundraisingEntry"
    LEFT JOIN "danceblue"."FundraisingAssignment" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."FundraisingAssignment"."fundraisingId"
    LEFT JOIN "danceblue"."DailyDepartmentNotification" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."DailyDepartmentNotification"."fundraisingEntryId"
    LEFT JOIN "danceblue"."DailyDepartmentNotificationBatch" ON "danceblue"."DailyDepartmentNotification"."batchId" = "danceblue"."DailyDepartmentNotificationBatch"."id"
    LEFT JOIN "danceblue"."DBFundsFundraisingEntry" ON "danceblue"."FundraisingEntry"."id" = "danceblue"."DBFundsFundraisingEntry"."fundraisingEntryId"
    LEFT JOIN "danceblue"."DBFundsTeam" ON "danceblue"."DBFundsFundraisingEntry"."dbFundsTeamId" = "danceblue"."DBFundsTeam"."id"
    LEFT JOIN "danceblue"."SolicitationCode" ON "danceblue"."SolicitationCode"."id" = COALESCE(
      "danceblue"."FundraisingEntry"."solicitationCodeOverrideId",
      "danceblue"."DailyDepartmentNotification"."solicitationCodeId",
      "danceblue"."DBFundsTeam"."solicitationCodeId"
    )
);