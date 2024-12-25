DROP VIEW "danceblue"."FundraisingEntryWithMeta";--> statement-breakpoint
ALTER TABLE "danceblue"."AuditLog" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Device" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Device" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Event" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Event" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."EventOccurrence" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."EventOccurrence" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."FeedItem" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."FeedItem" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."File" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."File" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Image" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Image" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotificationBatch" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotificationBatch" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonor" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonor" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."SolicitationCode" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."SolicitationCode" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Marathon" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Marathon" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHour" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHour" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHourMapImage" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHourMapImage" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Configuration" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Configuration" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."LoginFlowSession" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."LoginFlowSession" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Notification" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Notification" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Person" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Person" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
CREATE VIEW "danceblue"."FundraisingEntryWithMeta" AS (select "danceblue"."FundraisingEntry"."id", "danceblue"."FundraisingEntry"."uuid", "danceblue"."FundraisingEntry"."createdAt", "danceblue"."FundraisingEntry"."updatedAt", COALESCE("danceblue"."FundraisingEntry"."amountOverride", "danceblue"."DBFundsFundraisingEntry"."amount", "danceblue"."DailyDepartmentNotification"."combinedAmount") - COALESCE(
          (select sum("amount") from "danceblue"."FundraisingAssignment" where "danceblue"."FundraisingAssignment"."fundraisingId" = "danceblue"."FundraisingEntry"."id")
          , 0::numeric(65,30)) as "unassigned", COALESCE("danceblue"."FundraisingEntry"."amountOverride", "danceblue"."DBFundsFundraisingEntry"."amount", "danceblue"."DailyDepartmentNotification"."combinedAmount") as "amount", COALESCE("danceblue"."FundraisingEntry"."donatedToOverride", "danceblue"."DBFundsFundraisingEntry"."donatedTo", "danceblue"."DailyDepartmentNotification"."comment") as "donatedTo", COALESCE("danceblue"."FundraisingEntry"."donatedByOverride", "danceblue"."DBFundsFundraisingEntry"."donatedBy", "danceblue"."DailyDepartmentNotification"."combinedDonorName") as "donatedBy", COALESCE("danceblue"."FundraisingEntry"."donatedOnOverride"::timestamp without time zone, "danceblue"."DBFundsFundraisingEntry"."date", "danceblue"."DailyDepartmentNotification"."transactionDate"::timestamp without time zone) as "donatedOn", "danceblue"."FundraisingEntry"."notes", "danceblue"."FundraisingEntry"."enteredByPersonId", "danceblue"."FundraisingEntry"."solicitationCodeOverrideId", "danceblue"."FundraisingEntry"."batchTypeOverride", "danceblue"."FundraisingEntry"."donatedByOverride", "danceblue"."FundraisingEntry"."donatedOnOverride", "danceblue"."FundraisingEntry"."donatedToOverride", "danceblue"."FundraisingEntry"."amountOverride", "danceblue"."SolicitationCode"."text", "danceblue"."SolicitationCode"."id" as "solicitationCodeId", CASE
        WHEN "danceblue"."FundraisingEntry"."batchTypeOverride" IS NOT NULL THEN "danceblue"."FundraisingEntry"."batchTypeOverride"
        WHEN "danceblue"."DailyDepartmentNotification"."id" IS NULL THEN 'DBFunds'::"BatchType"
        WHEN "danceblue"."DailyDepartmentNotificationBatch"."id" IS NULL THEN NULL::"BatchType"
        WHEN "left"("right"("danceblue"."DailyDepartmentNotificationBatch"."batchId", 2), 1) = 'C'::text THEN 'Check'::"BatchType"
        WHEN "left"("right"("danceblue"."DailyDepartmentNotificationBatch"."batchId", 2), 1) = 'T'::text THEN 'Transmittal'::"BatchType"
        WHEN "left"("right"("danceblue"."DailyDepartmentNotificationBatch"."batchId", 2), 1) = 'D'::text THEN 'CreditCard'::"BatchType"
        WHEN "left"("right"("danceblue"."DailyDepartmentNotificationBatch"."batchId", 2), 1) = 'A'::text THEN 'ACH'::"BatchType"
        WHEN "left"("right"("danceblue"."DailyDepartmentNotificationBatch"."batchId", 2), 1) = 'N'::text THEN 'NonCash'::"BatchType"
        WHEN "left"("right"("danceblue"."DailyDepartmentNotificationBatch"."batchId", 2), 1) = 'X'::text THEN 'PayrollDeduction'::"BatchType"
        ELSE 'Unknown'::"BatchType"
      END as "batchType" from "danceblue"."FundraisingEntry" left join "danceblue"."FundraisingAssignment" on "danceblue"."FundraisingEntry"."id" = "danceblue"."FundraisingAssignment"."fundraisingId" left join "danceblue"."DailyDepartmentNotification" on "danceblue"."FundraisingEntry"."id" = "danceblue"."DailyDepartmentNotification"."fundraisingEntryId" left join "danceblue"."DailyDepartmentNotificationBatch" on "danceblue"."DailyDepartmentNotification"."batchId" = "danceblue"."DailyDepartmentNotificationBatch"."id" left join "danceblue"."DBFundsFundraisingEntry" on "danceblue"."FundraisingEntry"."id" = "danceblue"."DBFundsFundraisingEntry"."fundraisingEntryId" left join "danceblue"."DBFundsTeam" on "danceblue"."DBFundsFundraisingEntry"."dbFundsTeamId" = "danceblue"."DBFundsTeam"."id" left join "danceblue"."SolicitationCode" on "danceblue"."SolicitationCode"."id" = COALESCE("danceblue"."FundraisingEntry"."solicitationCodeOverrideId", "danceblue"."DailyDepartmentNotification"."solicitationCodeId", "danceblue"."DBFundsTeam"."solicitationCodeId"));