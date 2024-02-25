-- CreateEnum
CREATE TYPE "enum_memberships_position" AS ENUM ('Member', 'Captain');

-- CreateEnum
CREATE TYPE "enum_people_committee_name" AS ENUM ('programmingCommittee', 'fundraisingCommittee', 'communityDevelopmentCommittee', 'dancerRelationsCommittee', 'familyRelationsCommittee', 'techCommittee', 'operationsCommittee', 'marketingCommittee', 'corporateCommittee', 'miniMarathonsCommittee', 'viceCommittee');

-- CreateEnum
CREATE TYPE "enum_people_committee_role" AS ENUM ('Chair', 'Coordinator', 'Member');

-- CreateEnum
CREATE TYPE "enum_people_db_role" AS ENUM ('None', 'Public', 'TeamMember', 'TeamCaptain', 'Committee');

-- CreateEnum
CREATE TYPE "enum_point_opportunities_type" AS ENUM ('Spirit', 'Morale', 'Committee');

-- CreateEnum
CREATE TYPE "enum_teams_legacy_status" AS ENUM ('NewTeam', 'ReturningTeam', 'DemoTeam');

-- CreateEnum
CREATE TYPE "enum_teams_type" AS ENUM ('Spirit', 'Morale', 'Committee');

-- CreateTable
CREATE TABLE "configurations" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valid_after" TIMESTAMPTZ(6),
    "valid_until" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "expo_push_token" TEXT,
    "last_login" TIMESTAMPTZ(6),
    "last_user_id" INTEGER,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_images" (
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "event_id" INTEGER NOT NULL,
    "image_id" INTEGER NOT NULL,

    CONSTRAINT "event_images_pkey" PRIMARY KEY ("event_id","image_id")
);

-- CreateTable
CREATE TABLE "event_occurrences" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "full_day" BOOLEAN NOT NULL,
    "date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "event_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "location" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "url" TEXT,
    "image_data" BYTEA,
    "mime_type" VARCHAR(255),
    "thumb_hash" BYTEA,
    "alt" TEXT,
    "width" BIGINT NOT NULL,
    "height" BIGINT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_flow_sessions" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "code_verifier" TEXT,
    "redirect_to_after_login" TEXT NOT NULL,
    "set_cookie" BOOLEAN DEFAULT false,
    "send_token" BOOLEAN DEFAULT false,

    CONSTRAINT "login_flow_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "person_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "position" "enum_memberships_position" NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "name" TEXT,
    "email" TEXT NOT NULL,
    "linkblue" TEXT,
    "auth_ids" JSONB NOT NULL DEFAULT '{}',
    "db_role" "enum_people_db_role" NOT NULL DEFAULT 'None',
    "committee_role" "enum_people_committee_role",
    "committee_name" "enum_people_committee_name",

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_entries" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "comment" TEXT,
    "points" INTEGER NOT NULL,
    "person_from_id" INTEGER,
    "team_id" INTEGER NOT NULL,
    "point_opportunity_id" INTEGER,

    CONSTRAINT "point_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_opportunities" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "opportunity_date" TIMESTAMPTZ(6),
    "type" "enum_point_opportunities_type" NOT NULL,
    "event_id" INTEGER,

    CONSTRAINT "point_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sequelize_meta" (
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "sequelize_meta_name_unique" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "type" "enum_teams_type" NOT NULL,
    "legacy_status" "enum_teams_legacy_status" NOT NULL,
    "marathon_year" VARCHAR(4) NOT NULL,
    "persistent_identifier" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "configurations_uuid_unique" ON "configurations"("uuid");

-- CreateIndex
CREATE INDEX "configurations_uuid" ON "configurations"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "devices_uuid_unique" ON "devices"("uuid");

-- CreateIndex
CREATE INDEX "devices_uuid" ON "devices"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "event_occurrences_uuid_unique" ON "event_occurrences"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "events_uuid_unique" ON "events"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "images_uuid_unique" ON "images"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "images_url_unique" ON "images"("url");

-- CreateIndex
CREATE INDEX "images_uuid" ON "images"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "login_flow_sessions_uuid_unique" ON "login_flow_sessions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "people_uuid_unique" ON "people"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "people_email_unique" ON "people"("email");

-- CreateIndex
CREATE UNIQUE INDEX "people_linkblue_unique" ON "people"("linkblue");

-- CreateIndex
CREATE UNIQUE INDEX "point_opportunities_uuid_unique" ON "point_opportunities"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "teams_persistent_identifier_unique" ON "teams"("persistent_identifier");

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_last_user_id_fkey" FOREIGN KEY ("last_user_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_occurrences" ADD CONSTRAINT "event_occurrences_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_entries" ADD CONSTRAINT "point_entries_person_from_id_fkey" FOREIGN KEY ("person_from_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_entries" ADD CONSTRAINT "point_entries_point_opportunity_id_fkey" FOREIGN KEY ("point_opportunity_id") REFERENCES "point_opportunities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_entries" ADD CONSTRAINT "point_entries_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_opportunities" ADD CONSTRAINT "point_opportunities_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

