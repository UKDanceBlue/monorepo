-- DropForeignKey
DROP VIEW "teams_with_total_points";
DROP VIEW fundraising_entries_with_meta;
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
ALTER TABLE "FundraisingEntrySource"
  RENAME COLUMN "db_funds_entry_id" TO "dbFundsEntryId";
ALTER TABLE "FundraisingEntrySource"
  RENAME COLUMN "ddn_id" TO "ddnId";
ALTER TABLE "FundraisingEntrySource"
  RENAME COLUMN "entry_id" TO "entryId";
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
  RENAME COLUMN "entry_source_id" TO "entrySourceId";
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
CREATE VIEW "FundraisingEntriesWithMeta" AS
SELECT fe.id,
  fe.uuid,
  fe."createdAt",
  fe."updatedAt",
  COALESCE(
    -- Calculate unassigned using db_funds_team_entries if available
    (
      SELECT "dft"."amount"
      FROM "DBFundsFundraisingEntry" "dft"
        JOIN "FundraisingEntrySource" "fes" ON "dft"."id" = "fes"."dbFundsEntryId"
      WHERE "fes"."id" = "fe"."entrySourceId"
    ),
    -- Otherwise, use combinedAmount from DailyDepartmentNotification
    (
      SELECT "ddn"."combinedAmount"
      FROM "DailyDepartmentNotification" "ddn"
        JOIN "FundraisingEntrySource" "fes" ON "ddn"."id" = "fes"."ddnId"
      WHERE "fes"."id" = "fe"."entrySourceId"
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
  "fe"."enteredBy",
  "fe"."entrySourceId"
FROM "FundraisingEntry" "fe";
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
  rename column "legacy_status" to "legacyStatus";
ALTER TABLE "teams"
  rename column "persistent_identifier" to "persistentIdentifier";
ALTER TABLE "teams"
  RENAME COLUMN "db_funds_team_id" TO "dbFundsTeamId";
ALTER TABLE "teams"
  RENAME TO "Team";
ALTER TABLE "Team"
  RENAME COLUMN "committee_id" TO "correspondingCommitteeId";
create view "TeamsWithTotalPoints" (
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
) as
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