ALTER TABLE "danceblue"."_prisma_migrations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP VIEW "danceblue"."TeamsWithTotalPoints";--> statement-breakpoint
DROP VIEW "danceblue"."FundraisingEntryWithMeta";--> statement-breakpoint
DROP TABLE "danceblue"."_prisma_migrations" CASCADE;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" RENAME COLUMN "solicitationCodeId" TO "solicitationCodeOverrideId";--> statement-breakpoint
ALTER TABLE "danceblue"."EventOccurrence" DROP CONSTRAINT "EventOccurrence_eventId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Image" DROP CONSTRAINT "Image_fileId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" DROP CONSTRAINT "Membership_personId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" DROP CONSTRAINT "Membership_teamId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" DROP CONSTRAINT "PointEntry_personFromId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" DROP CONSTRAINT "PointEntry_pointOpportunityId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" DROP CONSTRAINT "PointEntry_teamId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" DROP CONSTRAINT "PointOpportunity_marathonId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" DROP CONSTRAINT "PointOpportunity_eventId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Device" DROP CONSTRAINT "Device_lastSeenPersonId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" DROP CONSTRAINT "NotificationDelivery_deviceId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" DROP CONSTRAINT "NotificationDelivery_notificationId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" DROP CONSTRAINT "Committee_parentCommitteeId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."FeedItem" DROP CONSTRAINT "FeedItem_imageId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" DROP CONSTRAINT "FundraisingAssignment_assignedBy_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" DROP CONSTRAINT "FundraisingAssignment_personId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" DROP CONSTRAINT "fundraising_assignment_parent_entry";
--> statement-breakpoint
ALTER TABLE "danceblue"."File" DROP CONSTRAINT "File_ownedBy_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Team" DROP CONSTRAINT "Team_correspondingCommitteeId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Team" DROP CONSTRAINT "Team_marathonId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."Team" DROP CONSTRAINT "Team_solicitationCodeId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" DROP CONSTRAINT "DBFundsFundraisingEntry_dbFundsTeamId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" DROP CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry";
--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" DROP CONSTRAINT "DBFundsTeam_marathonId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" DROP CONSTRAINT "DBFundsTeam_solicitationCodeId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_fundraisingEntry";
--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_batchId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_enteredByPersonId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."AuditLog" DROP CONSTRAINT "AuditLog_editingUserId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."AuthIdPair" DROP CONSTRAINT "AuthIdPair_personId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" DROP CONSTRAINT "EventImage_eventId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" DROP CONSTRAINT "EventImage_imageId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" DROP CONSTRAINT "DDNDonorLink_donorId_fkey";
--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" DROP CONSTRAINT "DDNDonorLink_ddnId_fkey";
--> statement-breakpoint
DROP INDEX "Configuration_uuid_idx";--> statement-breakpoint
DROP INDEX "Configuration_uuid_key";--> statement-breakpoint
DROP INDEX "LoginFlowSession_uuid_idx";--> statement-breakpoint
DROP INDEX "LoginFlowSession_uuid_key";--> statement-breakpoint
DROP INDEX "Event_remoteId_key";--> statement-breakpoint
DROP INDEX "Event_uuid_idx";--> statement-breakpoint
DROP INDEX "Event_uuid_key";--> statement-breakpoint
DROP INDEX "Person_email_key";--> statement-breakpoint
DROP INDEX "Person_linkblue_key";--> statement-breakpoint
DROP INDEX "Person_uuid_idx";--> statement-breakpoint
DROP INDEX "Person_uuid_key";--> statement-breakpoint
DROP INDEX "EventOccurrence_uuid_idx";--> statement-breakpoint
DROP INDEX "EventOccurrence_uuid_key";--> statement-breakpoint
DROP INDEX "Image_uuid_idx";--> statement-breakpoint
DROP INDEX "Image_uuid_key";--> statement-breakpoint
DROP INDEX "Membership_personId_teamId_key";--> statement-breakpoint
DROP INDEX "Membership_uuid_idx";--> statement-breakpoint
DROP INDEX "Membership_uuid_key";--> statement-breakpoint
DROP INDEX "PointEntry_uuid_idx";--> statement-breakpoint
DROP INDEX "PointEntry_uuid_key";--> statement-breakpoint
DROP INDEX "PointOpportunity_uuid_idx";--> statement-breakpoint
DROP INDEX "PointOpportunity_uuid_key";--> statement-breakpoint
DROP INDEX "Device_uuid_idx";--> statement-breakpoint
DROP INDEX "Device_uuid_key";--> statement-breakpoint
DROP INDEX "NotificationDelivery_receiptId_key";--> statement-breakpoint
DROP INDEX "NotificationDelivery_uuid_idx";--> statement-breakpoint
DROP INDEX "NotificationDelivery_uuid_key";--> statement-breakpoint
DROP INDEX "Notification_uuid_idx";--> statement-breakpoint
DROP INDEX "Notification_uuid_key";--> statement-breakpoint
DROP INDEX "Committee_identifier_key";--> statement-breakpoint
DROP INDEX "Committee_uuid_idx";--> statement-breakpoint
DROP INDEX "Committee_uuid_key";--> statement-breakpoint
DROP INDEX "DailyDepartmentNotificationBatch_batchId_key";--> statement-breakpoint
DROP INDEX "DailyDepartmentNotificationBatch_uuid_idx";--> statement-breakpoint
DROP INDEX "DailyDepartmentNotificationBatch_uuid_key";--> statement-breakpoint
DROP INDEX "FeedItem_uuid_idx";--> statement-breakpoint
DROP INDEX "FeedItem_uuid_key";--> statement-breakpoint
DROP INDEX "FundraisingAssignment_fundraisingId_personId_key";--> statement-breakpoint
DROP INDEX "FundraisingAssignment_uuid_idx";--> statement-breakpoint
DROP INDEX "FundraisingAssignment_uuid_key";--> statement-breakpoint
DROP INDEX "MarathonHourMapImage_uuid_key";--> statement-breakpoint
DROP INDEX "MarathonHour_uuid_key";--> statement-breakpoint
DROP INDEX "Marathon_uuid_idx";--> statement-breakpoint
DROP INDEX "Marathon_uuid_key";--> statement-breakpoint
DROP INDEX "Marathon_year_key";--> statement-breakpoint
DROP INDEX "File_uuid_idx";--> statement-breakpoint
DROP INDEX "File_uuid_key";--> statement-breakpoint
DROP INDEX "Team_marathonId_correspondingCommitteeId_key";--> statement-breakpoint
DROP INDEX "Team_marathonId_persistentIdentifier_key";--> statement-breakpoint
DROP INDEX "Team_uuid_idx";--> statement-breakpoint
DROP INDEX "Team_uuid_key";--> statement-breakpoint
DROP INDEX "DBFundsFundraisingEntry_donatedTo_donatedBy_date_dbFundsTea_key";--> statement-breakpoint
DROP INDEX "DBFundsFundraisingEntry_fundraisingEntryId_key";--> statement-breakpoint
DROP INDEX "DBFundsFundraisingEntry_uuid_key";--> statement-breakpoint
DROP INDEX "DBFundsTeam_solicitationCodeId_marathonId_key";--> statement-breakpoint
DROP INDEX "DBFundsTeam_uuid_key";--> statement-breakpoint
DROP INDEX "SolicitationCode_prefix_code_key";--> statement-breakpoint
DROP INDEX "SolicitationCode_uuid_idx";--> statement-breakpoint
DROP INDEX "SolicitationCode_uuid_key";--> statement-breakpoint
DROP INDEX "DDNDonor_donorId_key";--> statement-breakpoint
DROP INDEX "DDNDonor_uuid_idx";--> statement-breakpoint
DROP INDEX "DDNDonor_uuid_key";--> statement-breakpoint
DROP INDEX "DailyDepartmentNotification_fundraisingEntryId_key";--> statement-breakpoint
DROP INDEX "DailyDepartmentNotification_idSorter_processDate_batchId_so_key";--> statement-breakpoint
DROP INDEX "DailyDepartmentNotification_uuid_idx";--> statement-breakpoint
DROP INDEX "DailyDepartmentNotification_uuid_key";--> statement-breakpoint
DROP INDEX "FundraisingEntry_uuid_idx";--> statement-breakpoint
DROP INDEX "FundraisingEntry_uuid_key";--> statement-breakpoint
DROP INDEX "AuditLog_uuid_key";--> statement-breakpoint
ALTER TABLE "danceblue"."AuthIdPair" DROP CONSTRAINT "AuthIdPair_pkey";--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" DROP CONSTRAINT "EventImage_pkey";--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" DROP CONSTRAINT "DDNDonorLink_pkey";--> statement-breakpoint
ALTER TABLE "danceblue"."Configuration" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."LoginFlowSession" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Event" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Person" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."EventOccurrence" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Image" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ALTER COLUMN "pointOpportunityId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Device" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Notification" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotificationBatch" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."FeedItem" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ALTER COLUMN "amount" SET DATA TYPE numeric(65, 2);--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHourMapImage" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHour" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Marathon" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."File" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."SolicitationCode" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonor" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ALTER COLUMN "amountOverride" SET DATA TYPE numeric(65, 2);--> statement-breakpoint
ALTER TABLE "danceblue"."AuditLog" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "danceblue"."AuthIdPair" ADD CONSTRAINT "AuthIdPair_source_personId_pk" PRIMARY KEY("source","personId");--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" ADD CONSTRAINT "EventImage_eventId_imageId_pk" PRIMARY KEY("eventId","imageId");--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ADD CONSTRAINT "DDNDonorLink_donorId_ddnId_pk" PRIMARY KEY("donorId","ddnId");--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotificationBatch" ADD COLUMN "createdAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotificationBatch" ADD COLUMN "updatedAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD COLUMN "createdAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ADD COLUMN "createdAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonor" ADD COLUMN "createdAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonor" ADD COLUMN "updatedAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD COLUMN "createdAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD COLUMN "updatedAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ADD COLUMN "createdAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ADD COLUMN "updatedAt" timestamp (6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "danceblue"."EventOccurrence" ADD CONSTRAINT "EventOccurrence_eventId_Event_id_fk" FOREIGN KEY ("eventId") REFERENCES "danceblue"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Image" ADD CONSTRAINT "Image_fileId_File_id_fk" FOREIGN KEY ("fileId") REFERENCES "danceblue"."File"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ADD CONSTRAINT "Membership_personId_Person_id_fk" FOREIGN KEY ("personId") REFERENCES "danceblue"."Person"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ADD CONSTRAINT "Membership_teamId_Team_id_fk" FOREIGN KEY ("teamId") REFERENCES "danceblue"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ADD CONSTRAINT "PointEntry_personFromId_Person_id_fk" FOREIGN KEY ("personFromId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ADD CONSTRAINT "PointEntry_teamId_Team_id_fk" FOREIGN KEY ("teamId") REFERENCES "danceblue"."Team"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ADD CONSTRAINT "PointEntry_pointOpportunityId_PointOpportunity_id_fk" FOREIGN KEY ("pointOpportunityId") REFERENCES "danceblue"."PointOpportunity"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ADD CONSTRAINT "PointOpportunity_eventId_Event_id_fk" FOREIGN KEY ("eventId") REFERENCES "danceblue"."Event"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ADD CONSTRAINT "PointOpportunity_marathonId_Marathon_id_fk" FOREIGN KEY ("marathonId") REFERENCES "danceblue"."Marathon"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Device" ADD CONSTRAINT "Device_lastSeenPersonId_Person_id_fk" FOREIGN KEY ("lastSeenPersonId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_deviceId_Device_id_fk" FOREIGN KEY ("deviceId") REFERENCES "danceblue"."Device"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_Notification_id_fk" FOREIGN KEY ("notificationId") REFERENCES "danceblue"."Notification"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" ADD CONSTRAINT "Committee_parentCommitteeId_Committee_id_fk" FOREIGN KEY ("parentCommitteeId") REFERENCES "danceblue"."Committee"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FeedItem" ADD CONSTRAINT "FeedItem_imageId_Image_id_fk" FOREIGN KEY ("imageId") REFERENCES "danceblue"."Image"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "FundraisingAssignment_personId_Person_id_fk" FOREIGN KEY ("personId") REFERENCES "danceblue"."Person"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "FundraisingAssignment_fundraisingId_FundraisingEntry_id_fk" FOREIGN KEY ("fundraisingId") REFERENCES "danceblue"."FundraisingEntry"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "FundraisingAssignment_assignedBy_Person_id_fk" FOREIGN KEY ("assignedBy") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."File" ADD CONSTRAINT "File_ownedBy_Person_id_fk" FOREIGN KEY ("ownedBy") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_marathonId_Marathon_id_fk" FOREIGN KEY ("marathonId") REFERENCES "danceblue"."Marathon"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_correspondingCommitteeId_Committee_id_fk" FOREIGN KEY ("correspondingCommitteeId") REFERENCES "danceblue"."Committee"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_solicitationCodeId_SolicitationCode_id_fk" FOREIGN KEY ("solicitationCodeId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD CONSTRAINT "DBFundsFundraisingEntry_dbFundsTeamId_DBFundsTeam_id_fk" FOREIGN KEY ("dbFundsTeamId") REFERENCES "danceblue"."DBFundsTeam"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntryId_FundraisingEntry_id_fk" FOREIGN KEY ("fundraisingEntryId") REFERENCES "danceblue"."FundraisingEntry"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ADD CONSTRAINT "DBFundsTeam_marathonId_Marathon_id_fk" FOREIGN KEY ("marathonId") REFERENCES "danceblue"."Marathon"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ADD CONSTRAINT "DBFundsTeam_solicitationCodeId_SolicitationCode_id_fk" FOREIGN KEY ("solicitationCodeId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_SolicitationCode_id_fk" FOREIGN KEY ("solicitationCodeId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_fundraisingEntryId_FundraisingEntry_id_fk" FOREIGN KEY ("fundraisingEntryId") REFERENCES "danceblue"."FundraisingEntry"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_batchId_DailyDepartmentNotificationBatch_id_fk" FOREIGN KEY ("batchId") REFERENCES "danceblue"."DailyDepartmentNotificationBatch"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ADD CONSTRAINT "FundraisingEntry_enteredByPersonId_Person_id_fk" FOREIGN KEY ("enteredByPersonId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ADD CONSTRAINT "FundraisingEntry_solicitationCodeOverrideId_SolicitationCode_id_fk" FOREIGN KEY ("solicitationCodeOverrideId") REFERENCES "danceblue"."SolicitationCode"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."AuditLog" ADD CONSTRAINT "AuditLog_editingUserId_Person_id_fk" FOREIGN KEY ("editingUserId") REFERENCES "danceblue"."Person"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."AuthIdPair" ADD CONSTRAINT "AuthIdPair_personId_Person_id_fk" FOREIGN KEY ("personId") REFERENCES "danceblue"."Person"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" ADD CONSTRAINT "EventImage_eventId_Event_id_fk" FOREIGN KEY ("eventId") REFERENCES "danceblue"."Event"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."EventImage" ADD CONSTRAINT "EventImage_imageId_Image_id_fk" FOREIGN KEY ("imageId") REFERENCES "danceblue"."Image"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ADD CONSTRAINT "DDNDonorLink_donorId_DDNDonor_id_fk" FOREIGN KEY ("donorId") REFERENCES "danceblue"."DDNDonor"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonorLink" ADD CONSTRAINT "DDNDonorLink_ddnId_DailyDepartmentNotification_id_fk" FOREIGN KEY ("ddnId") REFERENCES "danceblue"."DailyDepartmentNotification"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "danceblue"."Configuration" ADD CONSTRAINT "Configuration_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."LoginFlowSession" ADD CONSTRAINT "LoginFlowSession_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Event" ADD CONSTRAINT "Event_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Event" ADD CONSTRAINT "Event_remoteId_unique" UNIQUE("remoteId");--> statement-breakpoint
ALTER TABLE "danceblue"."Person" ADD CONSTRAINT "Person_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Person" ADD CONSTRAINT "Person_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "danceblue"."Person" ADD CONSTRAINT "Person_linkblue_unique" UNIQUE("linkblue");--> statement-breakpoint
ALTER TABLE "danceblue"."EventOccurrence" ADD CONSTRAINT "EventOccurrence_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Image" ADD CONSTRAINT "Image_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ADD CONSTRAINT "Membership_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Membership" ADD CONSTRAINT "Membership_personId_teamId_unique" UNIQUE("personId","teamId");--> statement-breakpoint
ALTER TABLE "danceblue"."PointEntry" ADD CONSTRAINT "PointEntry_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."PointOpportunity" ADD CONSTRAINT "PointOpportunity_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Device" ADD CONSTRAINT "Device_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_receiptId_unique" UNIQUE("receiptId");--> statement-breakpoint
ALTER TABLE "danceblue"."Notification" ADD CONSTRAINT "Notification_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" ADD CONSTRAINT "Committee_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Committee" ADD CONSTRAINT "Committee_identifier_unique" UNIQUE("identifier");--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotificationBatch" ADD CONSTRAINT "DailyDepartmentNotificationBatch_batchId_unique" UNIQUE("batchId");--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotificationBatch" ADD CONSTRAINT "DailyDepartmentNotificationBatch_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."FeedItem" ADD CONSTRAINT "FeedItem_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "FundraisingAssignment_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingAssignment" ADD CONSTRAINT "FundraisingAssignment_personId_fundraisingId_unique" UNIQUE("personId","fundraisingId");--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHourMapImage" ADD CONSTRAINT "MarathonHourMapImage_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."MarathonHour" ADD CONSTRAINT "MarathonHour_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Marathon" ADD CONSTRAINT "Marathon_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Marathon" ADD CONSTRAINT "Marathon_year_unique" UNIQUE("year");--> statement-breakpoint
ALTER TABLE "danceblue"."File" ADD CONSTRAINT "File_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_persistentIdentifier_unique" UNIQUE("persistentIdentifier");--> statement-breakpoint
ALTER TABLE "danceblue"."Team" ADD CONSTRAINT "Team_correspondingCommitteeId_unique" UNIQUE("correspondingCommitteeId");--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD CONSTRAINT "DBFundsFundraisingEntry_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntryId_unique" UNIQUE("fundraisingEntryId");--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsFundraisingEntry" ADD CONSTRAINT "DBFundsFundraisingEntry_donatedTo_donatedBy_date_dbFundsTeamId_unique" UNIQUE("donatedTo","donatedBy","date","dbFundsTeamId");--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ADD CONSTRAINT "DBFundsTeam_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."DBFundsTeam" ADD CONSTRAINT "DBFundsTeam_solicitationCodeId_marathonId_unique" UNIQUE("solicitationCodeId","marathonId");--> statement-breakpoint
ALTER TABLE "danceblue"."SolicitationCode" ADD CONSTRAINT "SolicitationCode_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."SolicitationCode" ADD CONSTRAINT "SolicitationCode_prefix_code_unique" UNIQUE("prefix","code");--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonor" ADD CONSTRAINT "DDNDonor_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."DDNDonor" ADD CONSTRAINT "DDNDonor_donorId_unique" UNIQUE("donorId");--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_fundraisingEntryId_unique" UNIQUE("fundraisingEntryId");--> statement-breakpoint
ALTER TABLE "danceblue"."DailyDepartmentNotification" ADD CONSTRAINT "DailyDepartmentNotification_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."FundraisingEntry" ADD CONSTRAINT "FundraisingEntry_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
ALTER TABLE "danceblue"."AuditLog" ADD CONSTRAINT "AuditLog_uuid_unique" UNIQUE("uuid");--> statement-breakpoint
CREATE VIEW "danceblue"."FundraisingEntryWithMeta" AS (select "danceblue"."FundraisingEntry"."id", "danceblue"."FundraisingEntry"."uuid", "danceblue"."FundraisingEntry"."createdAt", "danceblue"."FundraisingEntry"."updatedAt", COALESCE("danceblue"."FundraisingEntry"."amountOverride", "danceblue"."DBFundsFundraisingEntry"."amount", "danceblue"."DailyDepartmentNotification"."combinedAmount") - COALESCE(( SELECT sum(assignment.amount) AS sum FROM "FundraisingAssignment" assignment WHERE assignment."fundraisingId" = "danceblue"."FundraisingEntry"."id"), 0::numeric(65,30)) as "unassigned", COALESCE("danceblue"."FundraisingEntry"."amountOverride", "danceblue"."DBFundsFundraisingEntry"."amount", "danceblue"."DailyDepartmentNotification"."combinedAmount") as "amount", COALESCE("danceblue"."FundraisingEntry"."donatedToOverride", "danceblue"."DBFundsFundraisingEntry"."donatedTo", "danceblue"."DailyDepartmentNotification"."comment") as "donatedTo", COALESCE("danceblue"."FundraisingEntry"."donatedByOverride", "danceblue"."DBFundsFundraisingEntry"."donatedBy", "danceblue"."DailyDepartmentNotification"."combinedDonorName") as "donatedBy", COALESCE("danceblue"."FundraisingEntry"."donatedOnOverride"::timestamp without time zone, "danceblue"."DBFundsFundraisingEntry"."date", "danceblue"."DailyDepartmentNotification"."transactionDate"::timestamp without time zone) as "donatedOn", "danceblue"."FundraisingEntry"."notes", "danceblue"."FundraisingEntry"."enteredByPersonId", "danceblue"."FundraisingEntry"."solicitationCodeOverrideId", "danceblue"."FundraisingEntry"."batchTypeOverride", "danceblue"."FundraisingEntry"."donatedByOverride", "danceblue"."FundraisingEntry"."donatedOnOverride", "danceblue"."FundraisingEntry"."donatedToOverride", "danceblue"."FundraisingEntry"."amountOverride", (SELECT format(
          '%s%4s - %s',
          "sc"."prefix",
          to_char(
              "sc"."code",
              'fm9999999999999999999999999999999999999999999999990000'
          ),
          "sc"."name"
        )
        FROM "SolicitationCode" "sc"
        WHERE "sc"."id" = COALESCE(
          "danceblue"."FundraisingEntry"."solicitationCodeOverrideId",
          "danceblue"."DailyDepartmentNotification"."solicitationCodeId",
          "danceblue"."DBFundsTeam"."solicitationCodeId"
        )) as "solicitationCodeText", CASE
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
      END as "batchType" from "danceblue"."FundraisingEntry" left join "danceblue"."FundraisingAssignment" on "danceblue"."FundraisingEntry"."id" = "danceblue"."FundraisingAssignment"."fundraisingId" left join "danceblue"."DailyDepartmentNotification" on "danceblue"."FundraisingEntry"."id" = "danceblue"."DailyDepartmentNotification"."fundraisingEntryId" left join "danceblue"."DailyDepartmentNotificationBatch" on "danceblue"."DailyDepartmentNotification"."batchId" = "danceblue"."DailyDepartmentNotificationBatch"."id" left join "danceblue"."DBFundsFundraisingEntry" on "danceblue"."FundraisingEntry"."id" = "danceblue"."DBFundsFundraisingEntry"."fundraisingEntryId" left join "danceblue"."DBFundsTeam" on "danceblue"."DBFundsFundraisingEntry"."dbFundsTeamId" = "danceblue"."DBFundsTeam"."id");