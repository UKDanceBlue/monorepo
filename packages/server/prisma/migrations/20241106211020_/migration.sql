-- AlterTable
ALTER TABLE "AuthIdPair" RENAME CONSTRAINT "auth_id_pairs_pkey" TO "AuthIdPair_pkey";

-- AlterTable
ALTER TABLE "Committee" RENAME CONSTRAINT "committees_pkey" TO "Committee_pkey";

-- AlterTable
ALTER TABLE "Configuration" RENAME CONSTRAINT "configurations_pkey" TO "Configuration_pkey";

-- AlterTable
ALTER TABLE "DBFundsFundraisingEntry" RENAME CONSTRAINT "db_funds_team_entries_pkey" TO "DBFundsFundraisingEntry_pkey";

-- AlterTable
ALTER TABLE "DBFundsTeam" RENAME CONSTRAINT "db_funds_teams_pkey" TO "DBFundsTeam_pkey";

-- AlterTable
ALTER TABLE "Device" RENAME CONSTRAINT "devices_pkey" TO "Device_pkey";

-- AlterTable
ALTER TABLE "Event" RENAME CONSTRAINT "events_pkey" TO "Event_pkey";

-- AlterTable
ALTER TABLE "EventImage" RENAME CONSTRAINT "event_images_pkey" TO "EventImage_pkey";

-- AlterTable
ALTER TABLE "EventOccurrence" RENAME CONSTRAINT "event_occurrences_pkey" TO "EventOccurrence_pkey";

-- AlterTable
ALTER TABLE "FeedItem" RENAME CONSTRAINT "feed_items_pkey" TO "FeedItem_pkey";

-- AlterTable
ALTER TABLE "File" RENAME CONSTRAINT "uploaded_files_pkey" TO "File_pkey";

-- AlterTable
ALTER TABLE "FundraisingAssignment" RENAME CONSTRAINT "fundraising_assignments_pkey" TO "FundraisingAssignment_pkey";

-- AlterTable
ALTER TABLE "FundraisingEntry" RENAME CONSTRAINT "fundraising_entries_pkey" TO "FundraisingEntry_pkey";

-- AlterTable
ALTER TABLE "Image" RENAME CONSTRAINT "images_pkey" TO "Image_pkey";

-- AlterTable
ALTER TABLE "JobState" RENAME CONSTRAINT "job_states_pkey" TO "JobState_pkey";

-- AlterTable
ALTER TABLE "LoginFlowSession" RENAME CONSTRAINT "login_flow_sessions_pkey" TO "LoginFlowSession_pkey";

-- AlterTable
ALTER TABLE "Marathon" RENAME CONSTRAINT "marathons_pkey" TO "Marathon_pkey";

-- AlterTable
ALTER TABLE "MarathonHour" RENAME CONSTRAINT "marathon_hours_pkey" TO "MarathonHour_pkey";

-- AlterTable
ALTER TABLE "MarathonHourMapImage" RENAME CONSTRAINT "marathon_hour_map_images_pkey" TO "MarathonHourMapImage_pkey";

-- AlterTable
ALTER TABLE "Membership" RENAME CONSTRAINT "memberships_pkey" TO "Membership_pkey";

-- AlterTable
ALTER TABLE "Notification" RENAME CONSTRAINT "notifications_pkey" TO "Notification_pkey";

-- AlterTable
ALTER TABLE "NotificationDelivery" RENAME CONSTRAINT "notification_deliveries_pkey" TO "NotificationDelivery_pkey";

-- AlterTable
ALTER TABLE "Person" RENAME CONSTRAINT "people_pkey" TO "Person_pkey";

-- AlterTable
ALTER TABLE "PointEntry" RENAME CONSTRAINT "point_entries_pkey" TO "PointEntry_pkey";

-- AlterTable
ALTER TABLE "PointOpportunity" RENAME CONSTRAINT "point_opportunities_pkey" TO "PointOpportunity_pkey";

-- AlterTable
ALTER TABLE "Team" RENAME CONSTRAINT "teams_pkey" TO "Team_pkey";

-- RenameForeignKey
ALTER TABLE "AuthIdPair" RENAME CONSTRAINT "auth_id_pairs_person_id_fkey" TO "AuthIdPair_personId_fkey";

-- RenameForeignKey
ALTER TABLE "Committee" RENAME CONSTRAINT "committees_parent_committee_id_fkey" TO "Committee_parentCommitteeId_fkey";

-- RenameForeignKey
ALTER TABLE "DBFundsFundraisingEntry" RENAME CONSTRAINT "db_funds_team_entries_team_db_num_fkey" TO "DBFundsFundraisingEntry_dbFundsTeamId_fkey";

-- RenameForeignKey
ALTER TABLE "DBFundsTeam" RENAME CONSTRAINT "db_funds_teams_marathon_id_fkey" TO "DBFundsTeam_marathonId_fkey";

-- RenameForeignKey
ALTER TABLE "DailyDepartmentNotification" RENAME CONSTRAINT "DailyDepartmentNotification_batch_id_fkey" TO "DailyDepartmentNotification_batchId_fkey";

-- RenameForeignKey
ALTER TABLE "Device" RENAME CONSTRAINT "devices_last_user_id_fkey" TO "Device_lastSeenPersonId_fkey";

-- RenameForeignKey
ALTER TABLE "EventImage" RENAME CONSTRAINT "event_images_event_id_fkey" TO "EventImage_eventId_fkey";

-- RenameForeignKey
ALTER TABLE "EventImage" RENAME CONSTRAINT "event_images_image_id_fkey" TO "EventImage_imageId_fkey";

-- RenameForeignKey
ALTER TABLE "EventOccurrence" RENAME CONSTRAINT "event_occurrences_event_id_fkey" TO "EventOccurrence_eventId_fkey";

-- RenameForeignKey
ALTER TABLE "FeedItem" RENAME CONSTRAINT "feed_items_image_id_fkey" TO "FeedItem_imageId_fkey";

-- RenameForeignKey
ALTER TABLE "File" RENAME CONSTRAINT "uploaded_files_owned_by_fkey" TO "File_ownedBy_fkey";

-- RenameForeignKey
ALTER TABLE "FundraisingAssignment" RENAME CONSTRAINT "fundraising_assignments_assigned_by_fkey" TO "FundraisingAssignment_assignedBy_fkey";

-- RenameForeignKey
ALTER TABLE "FundraisingAssignment" RENAME CONSTRAINT "fundraising_assignments_person_id_fkey" TO "FundraisingAssignment_personId_fkey";

-- RenameForeignKey
ALTER TABLE "FundraisingEntrySource" RENAME CONSTRAINT "FundraisingEntrySource_db_funds_entry_id_fkey" TO "FundraisingEntrySource_dbFundsEntryId_fkey";

-- RenameForeignKey
ALTER TABLE "FundraisingEntrySource" RENAME CONSTRAINT "FundraisingEntrySource_ddn_id_fkey" TO "FundraisingEntrySource_ddnId_fkey";

-- RenameForeignKey
ALTER TABLE "Image" RENAME CONSTRAINT "images_file_id_fkey" TO "Image_fileId_fkey";

-- RenameForeignKey
ALTER TABLE "MarathonHour" RENAME CONSTRAINT "marathon_hours_marathon_id_fkey" TO "MarathonHour_marathonId_fkey";

-- RenameForeignKey
ALTER TABLE "MarathonHourMapImage" RENAME CONSTRAINT "marathon_hour_map_images_image_id_fkey" TO "MarathonHourMapImage_imageId_fkey";

-- RenameForeignKey
ALTER TABLE "MarathonHourMapImage" RENAME CONSTRAINT "marathon_hour_map_images_marathon_hour_id_fkey" TO "MarathonHourMapImage_marathonHourId_fkey";

-- RenameForeignKey
ALTER TABLE "Membership" RENAME CONSTRAINT "memberships_person_id_fkey" TO "Membership_personId_fkey";

-- RenameForeignKey
ALTER TABLE "Membership" RENAME CONSTRAINT "memberships_team_id_fkey" TO "Membership_teamId_fkey";

-- RenameForeignKey
ALTER TABLE "NotificationDelivery" RENAME CONSTRAINT "notification_deliveries_device_id_fkey" TO "NotificationDelivery_deviceId_fkey";

-- RenameForeignKey
ALTER TABLE "NotificationDelivery" RENAME CONSTRAINT "notification_deliveries_notification_id_fkey" TO "NotificationDelivery_notificationId_fkey";

-- RenameForeignKey
ALTER TABLE "PointEntry" RENAME CONSTRAINT "point_entries_person_from_id_fkey" TO "PointEntry_personFromId_fkey";

-- RenameForeignKey
ALTER TABLE "PointEntry" RENAME CONSTRAINT "point_entries_point_opportunity_id_fkey" TO "PointEntry_pointOpportunityId_fkey";

-- RenameForeignKey
ALTER TABLE "PointEntry" RENAME CONSTRAINT "point_entries_team_id_fkey" TO "PointEntry_teamId_fkey";

-- RenameForeignKey
ALTER TABLE "PointOpportunity" RENAME CONSTRAINT "point_opportunities_event_id_fkey" TO "PointOpportunity_eventId_fkey";

-- RenameForeignKey
ALTER TABLE "PointOpportunity" RENAME CONSTRAINT "point_opportunities_marathon_id_fkey" TO "PointOpportunity_marathonId_fkey";

-- RenameForeignKey
ALTER TABLE "Team" RENAME CONSTRAINT "teams_committee_id_fkey" TO "Team_correspondingCommitteeId_fkey";

-- RenameForeignKey
ALTER TABLE "Team" RENAME CONSTRAINT "teams_db_funds_team_id_fkey" TO "Team_dbFundsTeamId_fkey";

-- RenameForeignKey
ALTER TABLE "Team" RENAME CONSTRAINT "teams_marathon_id_fkey" TO "Team_marathonId_fkey";

-- RenameIndex
ALTER INDEX "committees_identifier_key" RENAME TO "Committee_identifier_key";

-- RenameIndex
ALTER INDEX "committees_uuid" RENAME TO "Committee_uuid_idx";

-- RenameIndex
ALTER INDEX "committees_uuid_unique" RENAME TO "Committee_uuid_key";

-- RenameIndex
ALTER INDEX "configurations_uuid" RENAME TO "Configuration_uuid_idx";

-- RenameIndex
ALTER INDEX "configurations_uuid_unique" RENAME TO "Configuration_uuid_key";

-- RenameIndex
ALTER INDEX "db_funds_team_entries_donated_to_donated_by_date_team_db_nu_key" RENAME TO "DBFundsFundraisingEntry_donatedTo_donatedBy_date_dbFundsTea_key";

-- RenameIndex
ALTER INDEX "db_funds_team_entries_uuid_key" RENAME TO "DBFundsFundraisingEntry_uuid_key";

-- RenameIndex
ALTER INDEX "db_funds_teams_db_num_marathon_id_key" RENAME TO "DBFundsTeam_dbNum_marathonId_key";

-- RenameIndex
ALTER INDEX "db_funds_teams_uuid_key" RENAME TO "DBFundsTeam_uuid_key";

-- RenameIndex
ALTER INDEX "DailyDepartmentNotification_id_sorter_key" RENAME TO "DailyDepartmentNotification_idSorter_key";

-- RenameIndex
ALTER INDEX "devices_uuid" RENAME TO "Device_uuid_idx";

-- RenameIndex
ALTER INDEX "devices_uuid_unique" RENAME TO "Device_uuid_key";

-- RenameIndex
ALTER INDEX "events_uuid" RENAME TO "Event_uuid_idx";

-- RenameIndex
ALTER INDEX "events_uuid_unique" RENAME TO "Event_uuid_key";

-- RenameIndex
ALTER INDEX "event_occurrences_uuid" RENAME TO "EventOccurrence_uuid_idx";

-- RenameIndex
ALTER INDEX "event_occurrences_uuid_unique" RENAME TO "EventOccurrence_uuid_key";

-- RenameIndex
ALTER INDEX "feed_items_uuid" RENAME TO "FeedItem_uuid_idx";

-- RenameIndex
ALTER INDEX "feed_items_uuid_unique" RENAME TO "FeedItem_uuid_key";

-- RenameIndex
ALTER INDEX "uploaded_files_uuid" RENAME TO "File_uuid_idx";

-- RenameIndex
ALTER INDEX "uploaded_files_uuid_unique" RENAME TO "File_uuid_key";

-- RenameIndex
ALTER INDEX "fundraising_assignments_fundraising_id_person_id_key" RENAME TO "FundraisingAssignment_fundraisingId_personId_key";

-- RenameIndex
ALTER INDEX "fundraising_assignments_uuid" RENAME TO "FundraisingAssignment_uuid_idx";

-- RenameIndex
ALTER INDEX "fundraising_assignments_uuid_unique" RENAME TO "FundraisingAssignment_uuid_key";

-- RenameIndex
ALTER INDEX "fundraising_entries_entry_source_id_key" RENAME TO "FundraisingEntry_entrySourceId_key";

-- RenameIndex
ALTER INDEX "fundraising_entries_uuid" RENAME TO "FundraisingEntry_uuid_idx";

-- RenameIndex
ALTER INDEX "fundraising_entries_uuid_unique" RENAME TO "FundraisingEntry_uuid_key";

-- RenameIndex
ALTER INDEX "FundraisingEntrySource_entry_id_key" RENAME TO "FundraisingEntrySource_entryId_key";

-- RenameIndex
ALTER INDEX "fundraising_entry_sources_entry_id_db_funds_entry_id_key" RENAME TO "FundraisingEntrySource_entryId_dbFundsEntryId_key";

-- RenameIndex
ALTER INDEX "images_uuid" RENAME TO "Image_uuid_idx";

-- RenameIndex
ALTER INDEX "images_uuid_unique" RENAME TO "Image_uuid_key";

-- RenameIndex
ALTER INDEX "login_flow_sessions_uuid" RENAME TO "LoginFlowSession_uuid_idx";

-- RenameIndex
ALTER INDEX "login_flow_sessions_uuid_unique" RENAME TO "LoginFlowSession_uuid_key";

-- RenameIndex
ALTER INDEX "marathons_uuid" RENAME TO "Marathon_uuid_idx";

-- RenameIndex
ALTER INDEX "marathons_uuid_unique" RENAME TO "Marathon_uuid_key";

-- RenameIndex
ALTER INDEX "marathons_year_key" RENAME TO "Marathon_year_key";

-- RenameIndex
ALTER INDEX "marathon_hours_uuid" RENAME TO "MarathonHour_uuid_idx";

-- RenameIndex
ALTER INDEX "marathon_hours_uuid_unique" RENAME TO "MarathonHour_uuid_key";

-- RenameIndex
ALTER INDEX "marathon_hour_map_images_uuid" RENAME TO "MarathonHourMapImage_uuid_idx";

-- RenameIndex
ALTER INDEX "marathon_hour_map_images_uuid_unique" RENAME TO "MarathonHourMapImage_uuid_key";

-- RenameIndex
ALTER INDEX "memberships_person_id_team_id_key" RENAME TO "Membership_personId_teamId_key";

-- RenameIndex
ALTER INDEX "memberships_uuid" RENAME TO "Membership_uuid_idx";

-- RenameIndex
ALTER INDEX "memberships_uuid_unique" RENAME TO "Membership_uuid_key";

-- RenameIndex
ALTER INDEX "notifications_uuid" RENAME TO "Notification_uuid_idx";

-- RenameIndex
ALTER INDEX "notifications_uuid_unique" RENAME TO "Notification_uuid_key";

-- RenameIndex
ALTER INDEX "notification_deliveries_receipt_id_key" RENAME TO "NotificationDelivery_receiptId_key";

-- RenameIndex
ALTER INDEX "notification_deliveries_uuid" RENAME TO "NotificationDelivery_uuid_idx";

-- RenameIndex
ALTER INDEX "notification_deliveries_uuid_unique" RENAME TO "NotificationDelivery_uuid_key";

-- RenameIndex
ALTER INDEX "people_email_unique" RENAME TO "Person_email_key";

-- RenameIndex
ALTER INDEX "people_linkblue_unique" RENAME TO "Person_linkblue_key";

-- RenameIndex
ALTER INDEX "people_uuid" RENAME TO "Person_uuid_idx";

-- RenameIndex
ALTER INDEX "people_uuid_unique" RENAME TO "Person_uuid_key";

-- RenameIndex
ALTER INDEX "point_entries_uuid" RENAME TO "PointEntry_uuid_idx";

-- RenameIndex
ALTER INDEX "point_entries_uuid_unique" RENAME TO "PointEntry_uuid_key";

-- RenameIndex
ALTER INDEX "point_opportunities_uuid" RENAME TO "PointOpportunity_uuid_idx";

-- RenameIndex
ALTER INDEX "point_opportunities_uuid_unique" RENAME TO "PointOpportunity_uuid_key";

-- RenameIndex
ALTER INDEX "teams_marathon_id_committee_id_key" RENAME TO "Team_marathonId_correspondingCommitteeId_key";

-- RenameIndex
ALTER INDEX "teams_marathon_id_persistent_identifier_key" RENAME TO "Team_marathonId_persistentIdentifier_key";

-- RenameIndex
ALTER INDEX "teams_uuid" RENAME TO "Team_uuid_idx";

-- RenameIndex
ALTER INDEX "teams_uuid_unique" RENAME TO "Team_uuid_key";
