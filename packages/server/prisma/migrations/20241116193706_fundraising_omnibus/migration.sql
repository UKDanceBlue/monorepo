BEGIN;

DROP VIEW fundraising_entries_with_meta;

DROP VIEW "teams_with_total_points";

-- CreateEnum
CREATE TYPE "FundraisingEntryType" AS ENUM ('Cash', 'Check', 'Online', 'Legacy');

-- DropIndex
DROP INDEX "fundraising_entries_db_funds_entry_id_key";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_pkey",
    ADD COLUMN "id" SERIAL NOT NULL,
    ADD CONSTRAINT "DailyDepartmentNotification_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "db_funds_team_entries"
ADD COLUMN "fundraisingEntryWithMetaId" INTEGER;

-- AlterTable
ALTER TABLE "fundraising_assignments"
ADD COLUMN "assigned_by" INTEGER;

-- AlterTable
ALTER TABLE "fundraising_entries"
ADD COLUMN "entered_by" INTEGER,
    ADD COLUMN "entry_source_id" INTEGER,
    ADD COLUMN "notes" TEXT,
    ADD COLUMN "type" "FundraisingEntryType";

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_id_sorter_key" ON "DailyDepartmentNotification"("id_sorter");

-- CreateIndex
CREATE UNIQUE INDEX "fundraising_entries_entry_source_id_key" ON "fundraising_entries"("entry_source_id");

-- AddForeignKey
ALTER TABLE "fundraising_assignments"
ADD CONSTRAINT "fundraising_assignments_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "people"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

ALTER TABLE "fundraising_entries" DROP COLUMN "db_funds_entry_id";

-- DropForeignKey
-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "account_name" TO "accountName";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "account_number" TO "accountNumber";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "adv_fee_amt_phil" TO "advFeeAmtPhil";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "adv_fee_amt_unit" TO "advFeeAmtUnit";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "adv_fee_cc_phil" TO "advFeeCcPhil";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "adv_fee_cc_unit" TO "advFeeCcUnit";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "adv_fee_status" TO "advFeeStatus";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "batch_id" TO "batchId";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "behalf_honor_memorial" TO "behalfHonorMemorial";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "business_phone" TO "businessPhone";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "business_phone_restriction" TO "businessPhoneRestriction";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "combined_amount" TO "combinedAmount";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "combined_donor_name" TO "combinedDonorName";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "combined_donor_salutation" TO "combinedDonorSalutation";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "combined_donor_sort" TO "combinedDonorSort";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "div_first_gift" TO "divFirstGift";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_amount" TO "donor1Amount";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_constituency" TO "donor1Constituency";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_deceased" TO "donor1Deceased";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_degrees" TO "donor1Degrees";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_gift_key" TO "donor1GiftKey";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_id" TO "donor1Id";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_name" TO "donor1Name";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_pm" TO "donor1Pm";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_relation" TO "donor1Relation";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor1_title_bar" TO "donor1TitleBar";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_amount" TO "donor2Amount";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_constituency" TO "donor2Constituency";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_deceased" TO "donor2Deceased";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_degrees" TO "donor2Degrees";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_gift_key" TO "donor2GiftKey";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_id" TO "donor2Id";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_name" TO "donor2Name";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_pm" TO "donor2Pm";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_relation" TO "donor2Relation";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "donor2_title_bar" TO "donor2TitleBar";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "effective_date" TO "effectiveDate";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "email_restriction" TO "emailRestriction";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "gik_description" TO "gikDescription";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "gik_type" TO "gikType";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "hc_unit" TO "hcUnit";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "holding_destination" TO "holdingDestination";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "home_phone" TO "homePhone";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "home_phone_restriction" TO "homePhoneRestriction";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "id_sorter" TO "idSorter";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "jv_doc_date" TO "jvDocDate";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "jv_doc_num" TO "jvDocNum";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "matching_gift" TO "matchingGift";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "online_gift" TO "onlineGift";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "p_city" TO "pCity";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "p_line1" TO "pLine1";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "p_line2" TO "pLine2";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "p_line3" TO "pLine3";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "p_state" TO "pState";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "p_zip" TO "pZip";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "pledged_amount" TO "pledgedAmount";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "pledged_date" TO "pledgedDate";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "process_date" TO "processDate";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "sap_doc_date" TO "sapDocDate";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "sap_doc_num" TO "sapDocNum";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "sec_shares" TO "secShares";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "sec_type" TO "secType";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "solicitation_code" TO "solicitationCode";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "transaction_date" TO "transactionDate";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "transaction_type" TO "transactionType";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "transmittal_sn" TO "transmittalSn";

ALTER TABLE "DailyDepartmentNotification"
    RENAME COLUMN "uk_first_gift" TO "ukFirstGift";

-- AlterTable
ALTER TABLE "DailyDepartmentNotificationBatch"
    RENAME COLUMN "batch_id" TO "batchId";

ALTER TABLE "DailyDepartmentNotificationBatch"
    RENAME COLUMN "batch_type" TO "batchType";

-- AlterTable
ALTER TABLE "auth_id_pairs"
    RENAME COLUMN "person_id" TO "personId";

-- AlterTable
ALTER TABLE "committees"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "committees"
    RENAME COLUMN "parent_committee_id" TO "parentCommitteeId";

ALTER TABLE "committees"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "configurations"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "configurations"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "configurations"
    RENAME COLUMN "valid_after" TO "validAfter";

ALTER TABLE "configurations"
    RENAME COLUMN "valid_until" TO "validUntil";

-- AlterTable
ALTER TABLE "db_funds_team_entries"
    RENAME COLUMN "donated_by" TO "donatedBy";

ALTER TABLE "db_funds_team_entries"
    RENAME COLUMN "donated_to" TO "donatedTo";

ALTER TABLE "db_funds_team_entries"
    RENAME COLUMN "team_db_num" TO "dbFundsTeamId";

-- AlterTable
ALTER TABLE "db_funds_teams"
    RENAME COLUMN "db_num" TO "dbNum";

ALTER TABLE "db_funds_teams"
    RENAME COLUMN "marathon_id" TO "marathonId";

ALTER TABLE "db_funds_teams"
    RENAME COLUMN "total_amount" TO "totalAmount";

-- AlterTable
ALTER TABLE "devices"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "devices"
    RENAME COLUMN "expo_push_token" TO "expoPushToken";

ALTER TABLE "devices"
    RENAME COLUMN "last_login" TO "lastSeen";

ALTER TABLE "devices"
    RENAME COLUMN "last_user_id" TO "lastSeenPersonId";

ALTER TABLE "devices"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "event_images"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "event_images"
    RENAME COLUMN "event_id" TO "eventId";

ALTER TABLE "event_images"
    RENAME COLUMN "image_id" TO "imageId";

ALTER TABLE "event_images"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "event_occurrences"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "event_occurrences"
    RENAME COLUMN "end_date" TO "endDate";

ALTER TABLE "event_occurrences"
    RENAME COLUMN "event_id" TO "eventId";

ALTER TABLE "event_occurrences"
    RENAME COLUMN "full_day" TO "fullDay";

ALTER TABLE "event_occurrences"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "events"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "events"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "feed_items"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "feed_items"
    RENAME COLUMN "image_id" TO "imageId";

ALTER TABLE "feed_items"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "fundraising_assignments"
    RENAME COLUMN "assigned_by" TO "assignedBy";

ALTER TABLE "fundraising_assignments"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "fundraising_assignments"
    RENAME COLUMN "fundraising_id" TO "fundraisingId";

ALTER TABLE "fundraising_assignments"
    RENAME COLUMN "person_id" TO "personId";

ALTER TABLE "fundraising_assignments"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "fundraising_entries"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "fundraising_entries"
    RENAME COLUMN "entered_by" TO "enteredBy";

ALTER TABLE "fundraising_entries"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "images"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "images"
    RENAME COLUMN "file_id" TO "fileId";

ALTER TABLE "images"
    RENAME COLUMN "thumb_hash" TO "thumbHash";

ALTER TABLE "images"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "job_states"
    RENAME COLUMN "job_name" TO "jobName";

ALTER TABLE "job_states"
    RENAME COLUMN "last_run" TO "lastRun";

-- AlterTable
ALTER TABLE "login_flow_sessions"
    RENAME COLUMN "code_verifier" TO "codeVerifier";

ALTER TABLE "login_flow_sessions"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "login_flow_sessions"
    RENAME COLUMN "redirect_to_after_login" TO "redirectToAfterLogin";

ALTER TABLE "login_flow_sessions"
    RENAME COLUMN "send_token" TO "sendToken";

ALTER TABLE "login_flow_sessions"
    RENAME COLUMN "set_cookie" TO "setCookie";

ALTER TABLE "login_flow_sessions"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "marathon_hour_map_images"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "marathon_hour_map_images"
    RENAME COLUMN "image_id" TO "imageId";

ALTER TABLE "marathon_hour_map_images"
    RENAME COLUMN "marathon_hour_id" TO "marathonHourId";

ALTER TABLE "marathon_hour_map_images"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "marathon_hours"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "marathon_hours"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "auth_id_pairs"
    RENAME TO "AuthIdPair";

-- AlterTable
ALTER TABLE "committees"
    RENAME TO "Committee";

-- AlterTable
ALTER TABLE "configurations"
    RENAME TO "Configuration";

-- AlterTable
ALTER TABLE "db_funds_team_entries"
    RENAME TO "DBFundsFundraisingEntry";

-- AlterTable
ALTER TABLE "db_funds_teams"
    RENAME TO "DBFundsTeam";

-- AlterTable
ALTER TABLE "devices"
    RENAME TO "Device";

-- AlterTable
ALTER TABLE "event_images"
    RENAME TO "EventImage";

-- AlterTable
ALTER TABLE "event_occurrences"
    RENAME TO "EventOccurrence";

-- AlterTable
ALTER TABLE "events"
    RENAME TO "Event";

-- AlterTable
ALTER TABLE "feed_items"
    RENAME TO "FeedItem";

-- AlterTable
ALTER TABLE "fundraising_assignments"
    RENAME TO "FundraisingAssignment";

-- AlterTable
ALTER TABLE "fundraising_entries"
    RENAME TO "FundraisingEntry";

-- AlterTable
ALTER TABLE "images"
    RENAME TO "Image";

-- AlterTable
ALTER TABLE "job_states"
    RENAME TO "JobState";

-- AlterTable
ALTER TABLE "login_flow_sessions"
    RENAME TO "LoginFlowSession";

-- AlterTable
ALTER TABLE "marathon_hour_map_images"
    RENAME TO "MarathonHourMapImage";

-- AlterTable
ALTER TABLE "marathon_hours"
    RENAME COLUMN "marathon_id" TO "marathonId";

ALTER TABLE "marathon_hours"
    RENAME COLUMN "duration_info" TO "durationInfo";

ALTER TABLE "marathon_hours"
    RENAME COLUMN "shown_starting_at" TO "shownStartingAt";

ALTER TABLE "marathon_hours"
    RENAME TO "MarathonHour";

-- AlterTable
ALTER TABLE "marathons"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "marathons"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "marathons"
    RENAME COLUMN "start_date" TO "startDate";

ALTER TABLE "marathons"
    RENAME COLUMN "end_date" TO "endDate";

ALTER TABLE "marathons"
    RENAME TO "Marathon";

-- AlterTable
ALTER TABLE "memberships"
    RENAME TO "Membership";

ALTER TABLE "Membership"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "Membership"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "Membership"
    RENAME COLUMN "person_id" TO "personId";

ALTER TABLE "Membership"
    RENAME COLUMN "team_id" TO "teamId";

ALTER TABLE "Membership"
    RENAME COLUMN "committee_role" TO "committeeRole";

-- AlterTable
ALTER TABLE "notification_deliveries"
    RENAME TO "NotificationDelivery";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "notification_id" TO "notificationId";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "device_id" TO "deviceId";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "receipt_id" TO "receiptId";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "delivery_error" TO "deliveryError";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "chunk_uuid" TO "chunkUuid";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "delivered_by" TO "receiptCheckedAt";

ALTER TABLE "NotificationDelivery"
    RENAME COLUMN "sent_at" TO "sentAt";

-- AlterTable
ALTER TABLE "notifications"
    RENAME TO "Notification";

ALTER TABLE "Notification"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "Notification"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "Notification"
    RENAME COLUMN "delivery_issue" TO "deliveryIssue";

ALTER TABLE "Notification"
    RENAME COLUMN "delivery_issue_acknowledged_at" TO "deliveryIssueAcknowledgedAt";

ALTER TABLE "Notification"
    RENAME COLUMN "send_at" TO "sendAt";

ALTER TABLE "Notification"
    RENAME COLUMN "started_sending_at" TO "startedSendingAt";

-- AlterTable
ALTER TABLE "people"
    RENAME TO "Person";

ALTER TABLE "Person"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "Person"
    RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "point_entries"
    RENAME TO "PointEntry";

ALTER TABLE "PointEntry"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "PointEntry"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "PointEntry"
    RENAME COLUMN "team_id" TO "teamId";

ALTER TABLE "PointEntry"
    RENAME COLUMN "person_from_id" TO "personFromId";

ALTER TABLE "PointEntry"
    RENAME COLUMN "point_opportunity_id" TO "pointOpportunityId";

-- AlterTable
ALTER TABLE "point_opportunities"
    RENAME TO "PointOpportunity";

ALTER TABLE "PointOpportunity"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "PointOpportunity"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "PointOpportunity"
    RENAME COLUMN "opportunity_date" TO "opportunityDate";

ALTER TABLE "PointOpportunity"
    RENAME COLUMN "event_id" TO "eventId";

ALTER TABLE "PointOpportunity"
    RENAME COLUMN "marathon_id" TO "marathonId";

-- AlterTable
ALTER TABLE "teams"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "teams"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "teams"
    RENAME COLUMN "marathon_id" TO "marathonId";

ALTER TABLE "teams"
    RENAME COLUMN "legacy_status" TO "legacyStatus";

ALTER TABLE "teams"
    RENAME COLUMN "persistent_identifier" TO "persistentIdentifier";

ALTER TABLE "teams"
    RENAME COLUMN "db_funds_team_id" TO "dbFundsTeamId";

ALTER TABLE "teams"
    RENAME TO "Team";

ALTER TABLE "Team"
    RENAME COLUMN "committee_id" TO "correspondingCommitteeId";

-- AlterTable
ALTER TABLE "uploaded_files"
    RENAME TO "File";

ALTER TABLE "File"
    RENAME COLUMN "created_at" TO "createdAt";

ALTER TABLE "File"
    RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "File"
    RENAME COLUMN "mime_type" TO "mimeTypeName";

ALTER TABLE "File"
    RENAME COLUMN "mime_subtype" TO "mimeSubtypeName";

ALTER TABLE "File"
    RENAME COLUMN "mime_parameters" TO "mimeParameters";

ALTER TABLE "File"
    RENAME COLUMN "location_url" TO "locationUrl";

ALTER TABLE "File"
    RENAME COLUMN "requires_login" TO "requiresLogin";

ALTER TABLE "File"
    RENAME COLUMN "owned_by" TO "ownedBy";

ALTER TYPE enum_people_committee_name
RENAME TO "CommitteeName";

ALTER TYPE enum_memberships_position
RENAME TO "MembershipPosition";

ALTER TYPE enum_people_committee_role
RENAME TO "CommitteeRole";

ALTER TYPE enum_point_opportunities_type
RENAME TO "PointOpportunityType";

ALTER TYPE enum_teams_legacy_status
RENAME TO "TeamLegacyStatus";

ALTER TYPE enum_teams_type
RENAME TO "TeamType";

-- AlterTable
ALTER TABLE "AuthIdPair"
    RENAME CONSTRAINT "auth_id_pairs_pkey" TO "AuthIdPair_pkey";

-- AlterTable
ALTER TABLE "Committee"
    RENAME CONSTRAINT "committees_pkey" TO "Committee_pkey";

-- AlterTable
ALTER TABLE "Configuration"
    RENAME CONSTRAINT "configurations_pkey" TO "Configuration_pkey";

-- AlterTable
ALTER TABLE "DBFundsFundraisingEntry"
    RENAME CONSTRAINT "db_funds_team_entries_pkey" TO "DBFundsFundraisingEntry_pkey";

-- AlterTable
ALTER TABLE "DBFundsTeam"
    RENAME CONSTRAINT "db_funds_teams_pkey" TO "DBFundsTeam_pkey";

-- AlterTable
ALTER TABLE "Device"
    RENAME CONSTRAINT "devices_pkey" TO "Device_pkey";

-- AlterTable
ALTER TABLE "Event"
    RENAME CONSTRAINT "events_pkey" TO "Event_pkey";

-- AlterTable
ALTER TABLE "EventImage"
    RENAME CONSTRAINT "event_images_pkey" TO "EventImage_pkey";

-- AlterTable
ALTER TABLE "EventOccurrence"
    RENAME CONSTRAINT "event_occurrences_pkey" TO "EventOccurrence_pkey";

-- AlterTable
ALTER TABLE "FeedItem"
    RENAME CONSTRAINT "feed_items_pkey" TO "FeedItem_pkey";

-- AlterTable
ALTER TABLE "File"
    RENAME CONSTRAINT "uploaded_files_pkey" TO "File_pkey";

-- AlterTable
ALTER TABLE "FundraisingAssignment"
    RENAME CONSTRAINT "fundraising_assignments_pkey" TO "FundraisingAssignment_pkey";

-- AlterTable
ALTER TABLE "FundraisingEntry"
    RENAME CONSTRAINT "fundraising_entries_pkey" TO "FundraisingEntry_pkey";

-- AlterTable
ALTER TABLE "Image"
    RENAME CONSTRAINT "images_pkey" TO "Image_pkey";

-- AlterTable
ALTER TABLE "JobState"
    RENAME CONSTRAINT "job_states_pkey" TO "JobState_pkey";

-- AlterTable
ALTER TABLE "LoginFlowSession"
    RENAME CONSTRAINT "login_flow_sessions_pkey" TO "LoginFlowSession_pkey";

-- AlterTable
ALTER TABLE "Marathon"
    RENAME CONSTRAINT "marathons_pkey" TO "Marathon_pkey";

-- AlterTable
ALTER TABLE "MarathonHour"
    RENAME CONSTRAINT "marathon_hours_pkey" TO "MarathonHour_pkey";

-- AlterTable
ALTER TABLE "MarathonHourMapImage"
    RENAME CONSTRAINT "marathon_hour_map_images_pkey" TO "MarathonHourMapImage_pkey";

-- AlterTable
ALTER TABLE "Membership"
    RENAME CONSTRAINT "memberships_pkey" TO "Membership_pkey";

-- AlterTable
ALTER TABLE "Notification"
    RENAME CONSTRAINT "notifications_pkey" TO "Notification_pkey";

-- AlterTable
ALTER TABLE "NotificationDelivery"
    RENAME CONSTRAINT "notification_deliveries_pkey" TO "NotificationDelivery_pkey";

-- AlterTable
ALTER TABLE "Person"
    RENAME CONSTRAINT "people_pkey" TO "Person_pkey";

-- AlterTable
ALTER TABLE "PointEntry"
    RENAME CONSTRAINT "point_entries_pkey" TO "PointEntry_pkey";

-- AlterTable
ALTER TABLE "PointOpportunity"
    RENAME CONSTRAINT "point_opportunities_pkey" TO "PointOpportunity_pkey";

-- AlterTable
ALTER TABLE "Team"
    RENAME CONSTRAINT "teams_pkey" TO "Team_pkey";

-- RenameForeignKey
ALTER TABLE "AuthIdPair"
    RENAME CONSTRAINT "auth_id_pairs_person_id_fkey" TO "AuthIdPair_personId_fkey";

-- RenameForeignKey
ALTER TABLE "Committee"
    RENAME CONSTRAINT "committees_parent_committee_id_fkey" TO "Committee_parentCommitteeId_fkey";

-- RenameForeignKey
ALTER TABLE "DBFundsFundraisingEntry"
    RENAME CONSTRAINT "db_funds_team_entries_team_db_num_fkey" TO "DBFundsFundraisingEntry_dbFundsTeamId_fkey";

-- RenameForeignKey
ALTER TABLE "DBFundsTeam"
    RENAME CONSTRAINT "db_funds_teams_marathon_id_fkey" TO "DBFundsTeam_marathonId_fkey";

-- RenameForeignKey
ALTER TABLE "DailyDepartmentNotification"
    RENAME CONSTRAINT "DailyDepartmentNotification_batch_id_fkey" TO "DailyDepartmentNotification_batchId_fkey";

-- RenameForeignKey
ALTER TABLE "Device"
    RENAME CONSTRAINT "devices_last_user_id_fkey" TO "Device_lastSeenPersonId_fkey";

-- RenameForeignKey
ALTER TABLE "EventImage"
    RENAME CONSTRAINT "event_images_event_id_fkey" TO "EventImage_eventId_fkey";

-- RenameForeignKey
ALTER TABLE "EventImage"
    RENAME CONSTRAINT "event_images_image_id_fkey" TO "EventImage_imageId_fkey";

-- RenameForeignKey
ALTER TABLE "EventOccurrence"
    RENAME CONSTRAINT "event_occurrences_event_id_fkey" TO "EventOccurrence_eventId_fkey";

-- RenameForeignKey
ALTER TABLE "FeedItem"
    RENAME CONSTRAINT "feed_items_image_id_fkey" TO "FeedItem_imageId_fkey";

-- RenameForeignKey
ALTER TABLE "File"
    RENAME CONSTRAINT "uploaded_files_owned_by_fkey" TO "File_ownedBy_fkey";

-- RenameForeignKey
ALTER TABLE "FundraisingAssignment"
    RENAME CONSTRAINT "fundraising_assignments_assigned_by_fkey" TO "FundraisingAssignment_assignedBy_fkey";

-- RenameForeignKey
ALTER TABLE "FundraisingAssignment"
    RENAME CONSTRAINT "fundraising_assignments_person_id_fkey" TO "FundraisingAssignment_personId_fkey";

-- RenameForeignKey
ALTER TABLE "Image"
    RENAME CONSTRAINT "images_file_id_fkey" TO "Image_fileId_fkey";

-- RenameForeignKey
ALTER TABLE "MarathonHour"
    RENAME CONSTRAINT "marathon_hours_marathon_id_fkey" TO "MarathonHour_marathonId_fkey";

-- RenameForeignKey
ALTER TABLE "MarathonHourMapImage"
    RENAME CONSTRAINT "marathon_hour_map_images_image_id_fkey" TO "MarathonHourMapImage_imageId_fkey";

-- RenameForeignKey
ALTER TABLE "MarathonHourMapImage"
    RENAME CONSTRAINT "marathon_hour_map_images_marathon_hour_id_fkey" TO "MarathonHourMapImage_marathonHourId_fkey";

-- RenameForeignKey
ALTER TABLE "Membership"
    RENAME CONSTRAINT "memberships_person_id_fkey" TO "Membership_personId_fkey";

-- RenameForeignKey
ALTER TABLE "Membership"
    RENAME CONSTRAINT "memberships_team_id_fkey" TO "Membership_teamId_fkey";

-- RenameForeignKey
ALTER TABLE "NotificationDelivery"
    RENAME CONSTRAINT "notification_deliveries_device_id_fkey" TO "NotificationDelivery_deviceId_fkey";

-- RenameForeignKey
ALTER TABLE "NotificationDelivery"
    RENAME CONSTRAINT "notification_deliveries_notification_id_fkey" TO "NotificationDelivery_notificationId_fkey";

-- RenameForeignKey
ALTER TABLE "PointEntry"
    RENAME CONSTRAINT "point_entries_person_from_id_fkey" TO "PointEntry_personFromId_fkey";

-- RenameForeignKey
ALTER TABLE "PointEntry"
    RENAME CONSTRAINT "point_entries_point_opportunity_id_fkey" TO "PointEntry_pointOpportunityId_fkey";

-- RenameForeignKey
ALTER TABLE "PointEntry"
    RENAME CONSTRAINT "point_entries_team_id_fkey" TO "PointEntry_teamId_fkey";

-- RenameForeignKey
ALTER TABLE "PointOpportunity"
    RENAME CONSTRAINT "point_opportunities_event_id_fkey" TO "PointOpportunity_eventId_fkey";

-- RenameForeignKey
ALTER TABLE "PointOpportunity"
    RENAME CONSTRAINT "point_opportunities_marathon_id_fkey" TO "PointOpportunity_marathonId_fkey";

-- RenameForeignKey
ALTER TABLE "Team"
    RENAME CONSTRAINT "teams_committee_id_fkey" TO "Team_correspondingCommitteeId_fkey";

-- RenameForeignKey
ALTER TABLE "Team"
    RENAME CONSTRAINT "teams_db_funds_team_id_fkey" TO "Team_dbFundsTeamId_fkey";

-- RenameForeignKey
ALTER TABLE "Team"
    RENAME CONSTRAINT "teams_marathon_id_fkey" TO "Team_marathonId_fkey";

-- RenameIndex
ALTER INDEX "committees_identifier_key"
RENAME TO "Committee_identifier_key";

-- RenameIndex
ALTER INDEX "committees_uuid"
RENAME TO "Committee_uuid_idx";

-- RenameIndex
ALTER INDEX "committees_uuid_unique"
RENAME TO "Committee_uuid_key";

-- RenameIndex
ALTER INDEX "configurations_uuid"
RENAME TO "Configuration_uuid_idx";

-- RenameIndex
ALTER INDEX "configurations_uuid_unique"
RENAME TO "Configuration_uuid_key";

-- RenameIndex
ALTER INDEX "db_funds_team_entries_donated_to_donated_by_date_team_db_nu_key"
RENAME TO "DBFundsFundraisingEntry_donatedTo_donatedBy_date_dbFundsTea_key";

-- RenameIndex
ALTER INDEX "db_funds_team_entries_uuid_key"
RENAME TO "DBFundsFundraisingEntry_uuid_key";

-- RenameIndex
ALTER INDEX "db_funds_teams_db_num_marathon_id_key"
RENAME TO "DBFundsTeam_dbNum_marathonId_key";

-- RenameIndex
ALTER INDEX "db_funds_teams_uuid_key"
RENAME TO "DBFundsTeam_uuid_key";

-- RenameIndex
ALTER INDEX "DailyDepartmentNotification_id_sorter_key"
RENAME TO "DailyDepartmentNotification_idSorter_key";

-- RenameIndex
ALTER INDEX "devices_uuid"
RENAME TO "Device_uuid_idx";

-- RenameIndex
ALTER INDEX "devices_uuid_unique"
RENAME TO "Device_uuid_key";

-- RenameIndex
ALTER INDEX "events_uuid"
RENAME TO "Event_uuid_idx";

-- RenameIndex
ALTER INDEX "events_uuid_unique"
RENAME TO "Event_uuid_key";

-- RenameIndex
ALTER INDEX "event_occurrences_uuid"
RENAME TO "EventOccurrence_uuid_idx";

-- RenameIndex
ALTER INDEX "event_occurrences_uuid_unique"
RENAME TO "EventOccurrence_uuid_key";

-- RenameIndex
ALTER INDEX "feed_items_uuid"
RENAME TO "FeedItem_uuid_idx";

-- RenameIndex
ALTER INDEX "feed_items_uuid_unique"
RENAME TO "FeedItem_uuid_key";

-- RenameIndex
ALTER INDEX "uploaded_files_uuid"
RENAME TO "File_uuid_idx";

-- RenameIndex
ALTER INDEX "uploaded_files_uuid_unique"
RENAME TO "File_uuid_key";

-- RenameIndex
ALTER INDEX "fundraising_assignments_fundraising_id_person_id_key"
RENAME TO "FundraisingAssignment_fundraisingId_personId_key";

-- RenameIndex
ALTER INDEX "fundraising_assignments_uuid"
RENAME TO "FundraisingAssignment_uuid_idx";

-- RenameIndex
ALTER INDEX "fundraising_assignments_uuid_unique"
RENAME TO "FundraisingAssignment_uuid_key";

-- RenameIndex
ALTER INDEX "fundraising_entries_uuid"
RENAME TO "FundraisingEntry_uuid_idx";

-- RenameIndex
ALTER INDEX "fundraising_entries_uuid_unique"
RENAME TO "FundraisingEntry_uuid_key";

-- RenameIndex
ALTER INDEX "images_uuid"
RENAME TO "Image_uuid_idx";

-- RenameIndex
ALTER INDEX "images_uuid_unique"
RENAME TO "Image_uuid_key";

-- RenameIndex
ALTER INDEX "login_flow_sessions_uuid"
RENAME TO "LoginFlowSession_uuid_idx";

-- RenameIndex
ALTER INDEX "login_flow_sessions_uuid_unique"
RENAME TO "LoginFlowSession_uuid_key";

-- RenameIndex
ALTER INDEX "marathons_uuid"
RENAME TO "Marathon_uuid_idx";

-- RenameIndex
ALTER INDEX "marathons_uuid_unique"
RENAME TO "Marathon_uuid_key";

-- RenameIndex
ALTER INDEX "marathons_year_key"
RENAME TO "Marathon_year_key";

-- RenameIndex
ALTER INDEX "marathon_hours_uuid"
RENAME TO "MarathonHour_uuid_idx";

-- RenameIndex
ALTER INDEX "marathon_hours_uuid_unique"
RENAME TO "MarathonHour_uuid_key";

-- RenameIndex
ALTER INDEX "marathon_hour_map_images_uuid"
RENAME TO "MarathonHourMapImage_uuid_idx";

-- RenameIndex
ALTER INDEX "marathon_hour_map_images_uuid_unique"
RENAME TO "MarathonHourMapImage_uuid_key";

-- RenameIndex
ALTER INDEX "memberships_person_id_team_id_key"
RENAME TO "Membership_personId_teamId_key";

-- RenameIndex
ALTER INDEX "memberships_uuid"
RENAME TO "Membership_uuid_idx";

-- RenameIndex
ALTER INDEX "memberships_uuid_unique"
RENAME TO "Membership_uuid_key";

-- RenameIndex
ALTER INDEX "notifications_uuid"
RENAME TO "Notification_uuid_idx";

-- RenameIndex
ALTER INDEX "notifications_uuid_unique"
RENAME TO "Notification_uuid_key";

-- RenameIndex
ALTER INDEX "notification_deliveries_receipt_id_key"
RENAME TO "NotificationDelivery_receiptId_key";

-- RenameIndex
ALTER INDEX "notification_deliveries_uuid"
RENAME TO "NotificationDelivery_uuid_idx";

-- RenameIndex
ALTER INDEX "notification_deliveries_uuid_unique"
RENAME TO "NotificationDelivery_uuid_key";

-- RenameIndex
ALTER INDEX "people_email_unique"
RENAME TO "Person_email_key";

-- RenameIndex
ALTER INDEX "people_linkblue_unique"
RENAME TO "Person_linkblue_key";

-- RenameIndex
ALTER INDEX "people_uuid"
RENAME TO "Person_uuid_idx";

-- RenameIndex
ALTER INDEX "people_uuid_unique"
RENAME TO "Person_uuid_key";

-- RenameIndex
ALTER INDEX "point_entries_uuid"
RENAME TO "PointEntry_uuid_idx";

-- RenameIndex
ALTER INDEX "point_entries_uuid_unique"
RENAME TO "PointEntry_uuid_key";

-- RenameIndex
ALTER INDEX "point_opportunities_uuid"
RENAME TO "PointOpportunity_uuid_idx";

-- RenameIndex
ALTER INDEX "point_opportunities_uuid_unique"
RENAME TO "PointOpportunity_uuid_key";

-- RenameIndex
ALTER INDEX "teams_marathon_id_committee_id_key"
RENAME TO "Team_marathonId_correspondingCommitteeId_key";

-- RenameIndex
ALTER INDEX "teams_marathon_id_persistent_identifier_key"
RENAME TO "Team_marathonId_persistentIdentifier_key";

-- RenameIndex
ALTER INDEX "teams_uuid"
RENAME TO "Team_uuid_idx";

-- RenameIndex
ALTER INDEX "teams_uuid_unique"
RENAME TO "Team_uuid_key";

-- AlterTable
ALTER TABLE "DBFundsFundraisingEntry" DROP COLUMN "fundraisingEntryWithMetaId",
    ADD COLUMN "fundraisingEntryId" INTEGER;

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_dbFundsTeamId_fkey";

-- DropIndex
DROP INDEX "DBFundsTeam_dbNum_marathonId_key";

-- AlterTable
ALTER TABLE "DBFundsTeam"
ADD COLUMN "solicitationCodeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DailyDepartmentNotification" DROP COLUMN "solicitationCode",
    ADD COLUMN "solicitationCodeId" INTEGER NOT NULL,
    DROP COLUMN "donor1GiftKey",
    ADD COLUMN "donor1GiftKey" INTEGER,
    DROP COLUMN "donor2GiftKey",
    ADD COLUMN "donor2GiftKey" INTEGER;

-- AlterTable
ALTER TABLE "FundraisingEntry"
ADD COLUMN "teamOverrideId" INTEGER;

-- AlterTable
ALTER TABLE "Team"
ADD COLUMN "solicitationCodeId" INTEGER;

-- CreateTable
CREATE TABLE "SolicitationCode" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "prefix" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT,
    CONSTRAINT "SolicitationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolicitationCode_uuid_key" ON "SolicitationCode"("uuid");

-- CreateIndex
CREATE INDEX "SolicitationCode_uuid_idx" ON "SolicitationCode"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitationCode_prefix_code_key" ON "SolicitationCode"("prefix", "code");

-- CreateIndex
CREATE UNIQUE INDEX "DBFundsTeam_solicitationCodeId_marathonId_key" ON "DBFundsTeam"("solicitationCodeId", "marathonId");

-- AddForeignKey
ALTER TABLE "DBFundsTeam"
ADD CONSTRAINT "DBFundsTeam_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_enteredBy_fkey" FOREIGN KEY ("enteredBy") REFERENCES "Person"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_teamOverrideId_fkey" FOREIGN KEY ("teamOverrideId") REFERENCES "Team"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team"
ADD CONSTRAINT "Team_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

INSERT INTO "SolicitationCode" ("uuid", "updatedAt", "prefix", "code")
SELECT gen_random_uuid(),
    CURRENT_TIMESTAMP,
    'DB',
    "dbNum"
FROM "DBFundsTeam"
WHERE "dbNum" IS NOT NULL;

ALTER TABLE "DBFundsTeam" DROP COLUMN "dbNum";

-- DropForeignKey
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_enteredBy_fkey";

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ADD COLUMN "fundraisingEntryId" INTEGER;

-- AlterTable
ALTER TABLE "FundraisingEntry" DROP COLUMN "enteredBy",
    ADD COLUMN "enteredByPersonId" INTEGER,
    ADD COLUMN "solicitationCodeId" INTEGER;

-- AlterTable
ALTER TABLE "DBFundsFundraisingEntry"
ALTER COLUMN "fundraisingEntryId"
SET NOT NULL;

-- AlterTable
ALTER TABLE "DailyDepartmentNotification"
ALTER COLUMN "fundraisingEntryId"
SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DBFundsFundraisingEntry_fundraisingEntryId_key" ON "DBFundsFundraisingEntry"("fundraisingEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyDepartmentNotification_fundraisingEntryId_key" ON "DailyDepartmentNotification"("fundraisingEntryId");

-- AddForeignKey
ALTER TABLE "DBFundsFundraisingEntry"
ADD CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_enteredByPersonId_fkey" FOREIGN KEY ("enteredByPersonId") REFERENCES "Person"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingAssignment"
ADD CONSTRAINT "fundraising_assignment_parent_entry" FOREIGN KEY ("fundraisingId") REFERENCES "FundraisingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "DBFundsFundraisingEntry" DROP CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry";

-- DropForeignKey
ALTER TABLE "DailyDepartmentNotification" DROP CONSTRAINT "DailyDepartmentNotification_fundraisingEntry";

-- DropForeignKey
ALTER TABLE "FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey";

-- DropForeignKey
ALTER TABLE "FundraisingEntry" DROP CONSTRAINT "FundraisingEntry_teamOverrideId_fkey";

-- AddForeignKey
ALTER TABLE "DBFundsFundraisingEntry"
ADD CONSTRAINT "DBFundsFundraisingEntry_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDepartmentNotification"
ADD CONSTRAINT "DailyDepartmentNotification_fundraisingEntry" FOREIGN KEY ("fundraisingEntryId") REFERENCES "FundraisingEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundraisingEntry"
ADD CONSTRAINT "FundraisingEntry_solicitationCodeId_fkey" FOREIGN KEY ("solicitationCodeId") REFERENCES "SolicitationCode"("id") ON DELETE
SET NULL ON UPDATE CASCADE;

CREATE VIEW "TeamsWithTotalPoints" (
    "id",
    "uuid",
    "name",
    "type",
    "legacyStatus",
    "persistentIdentifier",
    "marathonId",
    "createdAt",
    "updatedAt",
    "totalPoints"
) AS
SELECT "Team"."id",
    "Team"."uuid",
    "Team"."name",
    "Team"."type",
    "Team"."legacyStatus",
    "Team"."persistentIdentifier",
    "Team"."marathonId",
    "Team"."createdAt",
    "Team"."updatedAt",
    COALESCE("points"."totalPoints", 0::bigint) AS "totalPoints"
FROM "Team"
    LEFT JOIN (
        SELECT sum("entry"."points") AS "totalPoints",
            "entry"."teamId"
        FROM "PointEntry" "entry"
        GROUP BY "entry"."teamId"
    ) "points" ON "Team"."id" = "points"."teamId";

CREATE VIEW "FundraisingEntryWithMeta" AS
SELECT "fe"."id",
    "fe"."uuid",
    "fe"."createdAt",
    "fe"."updatedAt",
    COALESCE(
        -- Calculate unassigned using db_funds_team_entries if available
        (
            SELECT "dft"."amount"
            FROM "DBFundsFundraisingEntry" "dft"
            WHERE "fe"."id" = "dft"."fundraisingEntryId"
        ),
        -- Otherwise, use combinedAmount from DailyDepartmentNotification
        (
            SELECT "ddn"."combinedAmount"
            FROM "DailyDepartmentNotification" "ddn"
            WHERE "fe"."id" = "ddn"."fundraisingEntryId"
        )
    ) - COALESCE(
        (
            SELECT SUM("assignment"."amount")
            FROM "FundraisingAssignment" "assignment"
            WHERE "assignment"."fundraisingId" = "fe"."id"
        ),
        0::numeric(65, 30)
    ) AS "unassigned",
    "fe"."notes",
    "fe"."type",
    "fe"."enteredByPersonId",
    "fe"."solicitationCodeId"
FROM "FundraisingEntry" "fe";

-- DropIndex
DROP INDEX "fundraising_entries_entry_source_id_key";

-- AlterTable
ALTER TABLE "FundraisingEntry" DROP COLUMN "teamOverrideId",
    DROP COLUMN "entry_source_id",
    ALTER COLUMN "type"
SET NOT NULL;

;

COMMIT;