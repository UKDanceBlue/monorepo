-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "danceblue";
--> statement-breakpoint
CREATE TYPE "danceblue"."AuthSource" AS ENUM('LinkBlue', 'Anonymous', 'Demo', 'Password');--> statement-breakpoint
CREATE TYPE "danceblue"."BatchType" AS ENUM('DBFunds', 'Check', 'Transmittal', 'CreditCard', 'ACH', 'NonCash', 'PayrollDeduction', 'Unknown');--> statement-breakpoint
CREATE TYPE "danceblue"."CommitteeName" AS ENUM('programmingCommittee', 'fundraisingCommittee', 'communityDevelopmentCommittee', 'dancerRelationsCommittee', 'familyRelationsCommittee', 'techCommittee', 'operationsCommittee', 'marketingCommittee', 'corporateCommittee', 'miniMarathonsCommittee', 'viceCommittee', 'overallCommittee');--> statement-breakpoint
CREATE TYPE "danceblue"."CommitteeRole" AS ENUM('Chair', 'Coordinator', 'Member');--> statement-breakpoint
CREATE TYPE "danceblue"."MembershipPosition" AS ENUM('Member', 'Captain');--> statement-breakpoint
CREATE TYPE "danceblue"."NotificationError" AS ENUM('DeviceNotRegistered', 'InvalidCredentials', 'MessageTooBig', 'MessageRateExceeded', 'MismatchSenderId', 'Unknown');--> statement-breakpoint
CREATE TYPE "danceblue"."PointOpportunityType" AS ENUM('Spirit', 'Morale', 'Committee');--> statement-breakpoint
CREATE TYPE "danceblue"."TeamLegacyStatus" AS ENUM('NewTeam', 'ReturningTeam', 'DemoTeam');--> statement-breakpoint
CREATE TYPE "danceblue"."TeamType" AS ENUM('Spirit', 'Morale', 'Mini');--> statement-breakpoint
CREATE TABLE "danceblue"."_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Configuration" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"validAfter" timestamp(6) with time zone,
	"validUntil" timestamp(6) with time zone,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."LoginFlowSession" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"codeVerifier" text NOT NULL,
	"redirectToAfterLogin" text NOT NULL,
	"setCookie" boolean DEFAULT false NOT NULL,
	"sendToken" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Event" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"description" text,
	"location" text,
	"remoteId" text
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Person" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"name" "citext",
	"email" "citext" NOT NULL,
	"linkblue" "citext",
	"hashedPassword" "bytea",
	"salt" "bytea"
);
--> statement-breakpoint
CREATE TABLE "danceblue"."EventOccurrence" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"fullDay" boolean DEFAULT false NOT NULL,
	"date" timestamp(6) with time zone NOT NULL,
	"endDate" timestamp(6) with time zone NOT NULL,
	"eventId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Image" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"thumbHash" "bytea",
	"alt" text,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"fileId" integer
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Membership" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"personId" integer NOT NULL,
	"teamId" integer NOT NULL,
	"position" "danceblue"."MembershipPosition" NOT NULL,
	"committeeRole" "danceblue"."CommitteeRole"
);
--> statement-breakpoint
CREATE TABLE "danceblue"."PointEntry" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"comment" text,
	"points" integer NOT NULL,
	"personFromId" integer,
	"teamId" integer NOT NULL,
	"pointOpportunityId" integer
);
--> statement-breakpoint
CREATE TABLE "danceblue"."PointOpportunity" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"name" text NOT NULL,
	"opportunityDate" timestamp(6) with time zone,
	"type" "danceblue"."PointOpportunityType" NOT NULL,
	"eventId" integer,
	"marathonId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Device" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"expoPushToken" text,
	"lastSeen" timestamp(6) with time zone,
	"lastSeenPersonId" integer,
	"verifier" text
);
--> statement-breakpoint
CREATE TABLE "danceblue"."NotificationDelivery" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"deviceId" integer NOT NULL,
	"notificationId" integer NOT NULL,
	"receiptId" text,
	"deliveryError" "danceblue"."NotificationError",
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"chunkUuid" uuid,
	"receiptCheckedAt" timestamp(6) with time zone,
	"sentAt" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"url" text,
	"deliveryIssue" text,
	"deliveryIssueAcknowledgedAt" timestamp(6) with time zone,
	"sendAt" timestamp(6) with time zone,
	"startedSendingAt" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Committee" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"identifier" "danceblue"."CommitteeName" NOT NULL,
	"parentCommitteeId" integer,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."DailyDepartmentNotificationBatch" (
	"batchId" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."FeedItem" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"title" text NOT NULL,
	"textContent" text,
	"imageId" integer
);
--> statement-breakpoint
CREATE TABLE "danceblue"."FundraisingAssignment" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"amount" numeric(65, 30) NOT NULL,
	"personId" integer NOT NULL,
	"fundraisingId" integer NOT NULL,
	"assignedBy" integer
);
--> statement-breakpoint
CREATE TABLE "danceblue"."JobState" (
	"jobName" text PRIMARY KEY NOT NULL,
	"lastRun" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."MarathonHourMapImage" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"marathonHourId" integer NOT NULL,
	"imageId" integer NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."MarathonHour" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"marathonId" integer NOT NULL,
	"title" text NOT NULL,
	"details" text,
	"shownStartingAt" timestamp(6) with time zone NOT NULL,
	"durationInfo" text NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Marathon" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"year" text NOT NULL,
	"startDate" timestamp(6) with time zone,
	"endDate" timestamp(6) with time zone
);
--> statement-breakpoint
CREATE TABLE "danceblue"."File" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"filename" text NOT NULL,
	"mimeTypeName" varchar(127) NOT NULL,
	"mimeSubtypeName" varchar(127) NOT NULL,
	"mimeParameters" text[],
	"locationUrl" text NOT NULL,
	"requiresLogin" boolean DEFAULT false NOT NULL,
	"ownedBy" integer,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."Team" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"name" text NOT NULL,
	"type" "danceblue"."TeamType" NOT NULL,
	"legacyStatus" "danceblue"."TeamLegacyStatus" NOT NULL,
	"persistentIdentifier" text,
	"marathonId" integer NOT NULL,
	"correspondingCommitteeId" integer,
	"dbFundsTeamId" integer,
	"solicitationCodeId" integer
);
--> statement-breakpoint
CREATE TABLE "danceblue"."DBFundsFundraisingEntry" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(65, 30) NOT NULL,
	"donatedBy" text,
	"donatedTo" text,
	"date" timestamp(3) NOT NULL,
	"dbFundsTeamId" integer NOT NULL,
	"uuid" uuid NOT NULL,
	"fundraisingEntryId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."DBFundsTeam" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"totalAmount" double precision NOT NULL,
	"active" boolean NOT NULL,
	"marathonId" integer,
	"uuid" uuid NOT NULL,
	"solicitationCodeId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."SolicitationCode" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"prefix" text NOT NULL,
	"code" integer NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "danceblue"."DDNDonor" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"donorId" text NOT NULL,
	"giftKey" text,
	"name" text,
	"deceased" boolean NOT NULL,
	"constituency" text,
	"titleBar" text,
	"pm" text,
	"degrees" text[],
	"emails" text[]
);
--> statement-breakpoint
CREATE TABLE "danceblue"."DailyDepartmentNotification" (
	"division" text,
	"department" text,
	"effectiveDate" date,
	"processDate" date NOT NULL,
	"pledgedDate" date,
	"transactionDate" date,
	"transactionType" text NOT NULL,
	"combinedAmount" numeric(65, 30) NOT NULL,
	"pledgedAmount" numeric(65, 30) NOT NULL,
	"accountNumber" text NOT NULL,
	"accountName" text NOT NULL,
	"holdingDestination" text,
	"comment" text,
	"secShares" text,
	"secType" text,
	"gikType" text,
	"gikDescription" text,
	"onlineGift" boolean NOT NULL,
	"solicitation" text,
	"behalfHonorMemorial" text,
	"matchingGift" text,
	"ukFirstGift" boolean NOT NULL,
	"divFirstGift" boolean NOT NULL,
	"idSorter" text NOT NULL,
	"combinedDonorName" text NOT NULL,
	"combinedDonorSalutation" text NOT NULL,
	"combinedDonorSort" text,
	"transmittalSn" text,
	"sapDocNum" text,
	"sapDocDate" date,
	"jvDocNum" text,
	"jvDocDate" date,
	"advFeeCcPhil" text,
	"advFeeAmtPhil" numeric(65, 30),
	"advFeeCcUnit" text,
	"advFeeAmtUnit" numeric(65, 30),
	"advFeeStatus" text,
	"hcUnit" text,
	"id" serial PRIMARY KEY NOT NULL,
	"solicitationCodeId" integer NOT NULL,
	"fundraisingEntryId" integer NOT NULL,
	"uuid" uuid NOT NULL,
	"batchId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."FundraisingEntry" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"notes" text,
	"enteredByPersonId" integer,
	"solicitationCodeId" integer,
	"amountOverride" numeric(65, 30),
	"batchTypeOverride" "danceblue"."BatchType",
	"donatedByOverride" text,
	"donatedOnOverride" date,
	"donatedToOverride" text
);
--> statement-breakpoint
CREATE TABLE "danceblue"."AuditLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid NOT NULL,
	"summary" text NOT NULL,
	"details" jsonb NOT NULL,
	"editingUserId" integer,
	"subjectGlobalId" text,
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "danceblue"."AuthIdPair" (
	"source" "danceblue"."AuthSource" NOT NULL,
	"value" text NOT NULL,
	"personId" integer NOT NULL,
	CONSTRAINT "AuthIdPair_pkey" PRIMARY KEY("source","personId")
);
--> statement-breakpoint
CREATE TABLE "danceblue"."EventImage" (
	"createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(6) with time zone NOT NULL,
	"eventId" integer NOT NULL,
	"imageId" integer NOT NULL,
	CONSTRAINT "EventImage_pkey" PRIMARY KEY("eventId","imageId")
);
--> statement-breakpoint
CREATE TABLE "danceblue"."DDNDonorLink" (
	"donorId" integer NOT NULL,
	"ddnId" integer NOT NULL,
	"amount" numeric(65, 30) NOT NULL,
	"relation" text,
	CONSTRAINT "DDNDonorLink_pkey" PRIMARY KEY("donorId","ddnId")
);
--> statement-breakpoint
ALTER TABLE "danceblue"."EventOccurrence" ADD CONSTRAINT "EventOccurrence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "danceblue"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Image" ADD CONSTRAINT "Image_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "danceblue"."File"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ADD CONSTRAINT "Membership_personId_fkey" FOREIGN KEY ("personId") REFERENCES "danceblue"."Person"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ADD CONSTRAINT "Membership_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "danceblue"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ADD CONSTRAINT "PointEntry_personFromId_fkey" FOREIGN KEY ("personFromId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ADD CONSTRAINT "PointEntry_pointOpportunityId_fkey" FOREIGN KEY ("pointOpportunityId") REFERENCES "danceblue"."PointOpportunity"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ADD CONSTRAINT "PointEntry_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "danceblue"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ADD CONSTRAINT "PointOpportunity_marathonId_fkey" FOREIGN KEY ("marathonId") REFERENCES "danceblue"."Marathon"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ADD CONSTRAINT "PointOpportunity_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "danceblue"."Event"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Device" ADD CONSTRAINT "Device_lastSeenPersonId_fkey" FOREIGN KEY ("lastSeenPersonId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "danceblue"."Device"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "danceblue"."Notification"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" ADD CONSTRAINT "Committee_parentCommitteeId_fkey" FOREIGN KEY ("parentCommitteeId") REFERENCES "danceblue"."Committee"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FeedItem" ADD CONSTRAINT "FeedItem_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "danceblue"."Image"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "FundraisingAssignment_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "FundraisingAssignment_personId_fkey" FOREIGN KEY ("personId") REFERENCES "danceblue"."Person"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "fundraising_assignment_parent_entry" FOREIGN KEY ("fundraisingId") REFERENCES "danceblue"."FundraisingEntry"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHourMapImage" ADD CONSTRAINT "MarathonHourMapImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "danceblue"."Image"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHourMapImage" ADD CONSTRAINT "MarathonHourMapImage_marathonHourId_fkey" FOREIGN KEY ("marathonHourId") REFERENCES "danceblue"."MarathonHour"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHour" ADD CONSTRAINT "MarathonHour_marathonId_fkey" FOREIGN KEY ("marathonId") REFERENCES "danceblue"."Marathon"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."File" ADD CONSTRAINT "File_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_correspondingCommitteeId_fkey" FOREIGN KEY ("correspondingCommitteeId") REFERENCES "danceblue"."Committee"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_marathonId_fkey" FOREIGN KEY ("marathonId") REFERENCES "danceblue"."Marathon"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD CONSTRAINT "DBFundsFundraisingEntry_dbFundsTeamId_fkey" FOREIGN KEY ("dbFundsTeamId") REFERENCES "danceblue"."DBFundsTeam"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "danceblue"."FundraisingEntry"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ADD CONSTRAINT "DBFundsTeam_marathonId_fkey" FOREIGN KEY ("marathonId") REFERENCES "danceblue"."Marathon"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ADD CONSTRAINT "DBFundsTeam_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "danceblue"."FundraisingEntry"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "danceblue"."DailyDepartmentNotificationBatch"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ADD CONSTRAINT "FundraisingEntry_enteredByPersonId_fkey" FOREIGN KEY ("enteredByPersonId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ADD CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."AuditLog" ADD CONSTRAINT "AuditLog_editingUserId_fkey" FOREIGN KEY ("editingUserId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."AuthIdPair" ADD CONSTRAINT "AuthIdPair_personId_fkey" FOREIGN KEY ("personId") REFERENCES "danceblue"."Person"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" ADD CONSTRAINT "EventImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "danceblue"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" ADD CONSTRAINT "EventImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "danceblue"."Image"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ADD CONSTRAINT "DDNDonorLink_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "danceblue"."DDNDonor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ADD CONSTRAINT "DDNDonorLink_ddnId_fkey" FOREIGN KEY ("ddnId") REFERENCES "danceblue"."DailyDepartmentNotification"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "Configuration_uuid_idx" ON "danceblue"."Configuration" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Configuration_uuid_key" ON "danceblue"."Configuration" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "LoginFlowSession_uuid_idx" ON "danceblue"."LoginFlowSession" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "LoginFlowSession_uuid_key" ON "danceblue"."LoginFlowSession" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Event_remoteId_key" ON "danceblue"."Event" USING btree ("remoteId" text_ops);--> statement-breakpoint
CREATE INDEX "Event_uuid_idx" ON "danceblue"."Event" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Event_uuid_key" ON "danceblue"."Event" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Person_email_key" ON "danceblue"."Person" USING btree ("email" citext_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Person_linkblue_key" ON "danceblue"."Person" USING btree ("linkblue" citext_ops);--> statement-breakpoint
CREATE INDEX "Person_uuid_idx" ON "danceblue"."Person" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Person_uuid_key" ON "danceblue"."Person" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "EventOccurrence_uuid_idx" ON "danceblue"."EventOccurrence" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "EventOccurrence_uuid_key" ON "danceblue"."EventOccurrence" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "Image_uuid_idx" ON "danceblue"."Image" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Image_uuid_key" ON "danceblue"."Image" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Membership_personId_teamId_key" ON "danceblue"."Membership" USING btree ("personId" int4_ops,"teamId" int4_ops);--> statement-breakpoint
CREATE INDEX "Membership_uuid_idx" ON "danceblue"."Membership" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Membership_uuid_key" ON "danceblue"."Membership" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "PointEntry_uuid_idx" ON "danceblue"."PointEntry" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PointEntry_uuid_key" ON "danceblue"."PointEntry" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "PointOpportunity_uuid_idx" ON "danceblue"."PointOpportunity" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "PointOpportunity_uuid_key" ON "danceblue"."PointOpportunity" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "Device_uuid_idx" ON "danceblue"."Device" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Device_uuid_key" ON "danceblue"."Device" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "NotificationDelivery_receiptId_key" ON "danceblue"."NotificationDelivery" USING btree ("receiptId" text_ops);--> statement-breakpoint
CREATE INDEX "NotificationDelivery_uuid_idx" ON "danceblue"."NotificationDelivery" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "NotificationDelivery_uuid_key" ON "danceblue"."NotificationDelivery" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "Notification_uuid_idx" ON "danceblue"."Notification" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Notification_uuid_key" ON "danceblue"."Notification" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Committee_identifier_key" ON "danceblue"."Committee" USING btree ("identifier" enum_ops);--> statement-breakpoint
CREATE INDEX "Committee_uuid_idx" ON "danceblue"."Committee" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Committee_uuid_key" ON "danceblue"."Committee" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DailyDepartmentNotificationBatch_batchId_key" ON "danceblue"."DailyDepartmentNotificationBatch" USING btree ("batchId" text_ops);--> statement-breakpoint
CREATE INDEX "DailyDepartmentNotificationBatch_uuid_idx" ON "danceblue"."DailyDepartmentNotificationBatch" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DailyDepartmentNotificationBatch_uuid_key" ON "danceblue"."DailyDepartmentNotificationBatch" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "FeedItem_uuid_idx" ON "danceblue"."FeedItem" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "FeedItem_uuid_key" ON "danceblue"."FeedItem" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "FundraisingAssignment_fundraisingId_personId_key" ON "danceblue"."FundraisingAssignment" USING btree ("fundraisingId" int4_ops,"personId" int4_ops);--> statement-breakpoint
CREATE INDEX "FundraisingAssignment_uuid_idx" ON "danceblue"."FundraisingAssignment" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "FundraisingAssignment_uuid_key" ON "danceblue"."FundraisingAssignment" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "MarathonHourMapImage_uuid_idx" ON "danceblue"."MarathonHourMapImage" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "MarathonHourMapImage_uuid_key" ON "danceblue"."MarathonHourMapImage" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "MarathonHour_uuid_idx" ON "danceblue"."MarathonHour" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "MarathonHour_uuid_key" ON "danceblue"."MarathonHour" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "Marathon_uuid_idx" ON "danceblue"."Marathon" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Marathon_uuid_key" ON "danceblue"."Marathon" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Marathon_year_key" ON "danceblue"."Marathon" USING btree ("year" text_ops);--> statement-breakpoint
CREATE INDEX "File_uuid_idx" ON "danceblue"."File" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "File_uuid_key" ON "danceblue"."File" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Team_marathonId_correspondingCommitteeId_key" ON "danceblue"."Team" USING btree ("marathonId" int4_ops,"correspondingCommitteeId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Team_marathonId_persistentIdentifier_key" ON "danceblue"."Team" USING btree ("marathonId" text_ops,"persistentIdentifier" int4_ops);--> statement-breakpoint
CREATE INDEX "Team_uuid_idx" ON "danceblue"."Team" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "Team_uuid_key" ON "danceblue"."Team" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DBFundsFundraisingEntry_donatedTo_donatedBy_date_dbFundsTea_key" ON "danceblue"."DBFundsFundraisingEntry" USING btree ("donatedTo" timestamp_ops,"donatedBy" timestamp_ops,"date" int4_ops,"dbFundsTeamId" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DBFundsFundraisingEntry_fundraisingEntryId_key" ON "danceblue"."DBFundsFundraisingEntry" USING btree ("fundraisingEntryId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DBFundsFundraisingEntry_uuid_key" ON "danceblue"."DBFundsFundraisingEntry" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DBFundsTeam_solicitationCodeId_marathonId_key" ON "danceblue"."DBFundsTeam" USING btree ("solicitationCodeId" int4_ops,"marathonId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DBFundsTeam_uuid_key" ON "danceblue"."DBFundsTeam" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SolicitationCode_prefix_code_key" ON "danceblue"."SolicitationCode" USING btree ("prefix" int4_ops,"code" int4_ops);--> statement-breakpoint
CREATE INDEX "SolicitationCode_uuid_idx" ON "danceblue"."SolicitationCode" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "SolicitationCode_uuid_key" ON "danceblue"."SolicitationCode" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DDNDonor_donorId_key" ON "danceblue"."DDNDonor" USING btree ("donorId" text_ops);--> statement-breakpoint
CREATE INDEX "DDNDonor_uuid_idx" ON "danceblue"."DDNDonor" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DDNDonor_uuid_key" ON "danceblue"."DDNDonor" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DailyDepartmentNotification_fundraisingEntryId_key" ON "danceblue"."DailyDepartmentNotification" USING btree ("fundraisingEntryId" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key" ON "danceblue"."DailyDepartmentNotification" USING btree ("idSorter" int4_ops,"processDate" int4_ops,"batchId" numeric_ops,"solicitationCodeId" text_ops,"combinedAmount" text_ops);--> statement-breakpoint
CREATE INDEX "DailyDepartmentNotification_uuid_idx" ON "danceblue"."DailyDepartmentNotification" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "DailyDepartmentNotification_uuid_key" ON "danceblue"."DailyDepartmentNotification" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE INDEX "FundraisingEntry_uuid_idx" ON "danceblue"."FundraisingEntry" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "FundraisingEntry_uuid_key" ON "danceblue"."FundraisingEntry" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "AuditLog_uuid_key" ON "danceblue"."AuditLog" USING btree ("uuid" uuid_ops);--> statement-breakpoint
CREATE VIEW "danceblue"."TeamsWithTotalPoints" AS (SELECT "Team".id, "Team".uuid, "Team".name, "Team".type, "Team"."legacyStatus", "Team"."persistentIdentifier", "Team"."marathonId", "Team"."createdAt", "Team"."updatedAt", COALESCE(points."totalPoints", 0::bigint) AS "totalPoints" FROM "Team" LEFT JOIN ( SELECT sum(entry.points) AS "totalPoints", entry."teamId" FROM "PointEntry" entry GROUP BY entry."teamId") points ON "Team".id = points."teamId");--> statement-breakpoint
CREATE VIEW "danceblue"."FundraisingEntryWithMeta" AS (SELECT fe.id, fe.uuid, fe."createdAt", fe."updatedAt", COALESCE(fe."amountOverride", dfe.amount, ddn."combinedAmount") - COALESCE(( SELECT sum(assignment.amount) AS sum FROM "FundraisingAssignment" assignment WHERE assignment."fundraisingId" = fe.id), 0::numeric(65,30)) AS unassigned, COALESCE(fe."amountOverride", dfe.amount, ddn."combinedAmount") AS amount, COALESCE(fe."donatedToOverride", dfe."donatedTo", ddn.comment) AS "donatedTo", COALESCE(fe."donatedByOverride", dfe."donatedBy", ddn."combinedDonorName") AS "donatedBy", COALESCE(fe."donatedOnOverride"::timestamp without time zone, dfe.date, ddn."transactionDate"::timestamp without time zone) AS "donatedOn", fe.notes, fe."enteredByPersonId", fe."solicitationCodeId" AS "solicitationCodeOverrideId", fe."batchTypeOverride", fe."donatedByOverride", fe."donatedOnOverride", fe."donatedToOverride", fe."amountOverride", ( SELECT format('%s%4s - %s'::text, sc.prefix, to_char(sc.code, 'fm9999999999999999999999999999999999999999999999990000'::text), sc.name) AS format FROM "SolicitationCode" sc WHERE sc.id = COALESCE(fe."solicitationCodeId", ddn."solicitationCodeId", dft."solicitationCodeId")) AS "solicitationCodeText", CASE WHEN fe."batchTypeOverride" IS NOT NULL THEN fe."batchTypeOverride" WHEN ddn.* IS NULL THEN 'DBFunds'::"BatchType" WHEN ddnb.* IS NULL THEN NULL::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'C'::text THEN 'Check'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'T'::text THEN 'Transmittal'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'D'::text THEN 'CreditCard'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'A'::text THEN 'ACH'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'N'::text THEN 'NonCash'::"BatchType" WHEN "left"("right"(ddnb."batchId", 2), 1) = 'X'::text THEN 'PayrollDeduction'::"BatchType" ELSE 'Unknown'::"BatchType" END AS "batchType" FROM "FundraisingEntry" fe LEFT JOIN "DailyDepartmentNotification" ddn ON fe.id = ddn."fundraisingEntryId" LEFT JOIN "DailyDepartmentNotificationBatch" ddnb ON ddn."batchId" = ddnb.id LEFT JOIN "DBFundsFundraisingEntry" dfe ON fe.id = dfe."fundraisingEntryId" LEFT JOIN "DBFundsTeam" dft ON dfe."dbFundsTeamId" = dft.id);
*/