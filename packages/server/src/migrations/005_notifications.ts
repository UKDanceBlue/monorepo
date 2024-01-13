import { NotificationPayloadPresentationType } from "@ukdanceblue/common";
import type { MigrationParams } from "umzug";

import type { MigrationContext } from "./migrationContext.js";

// HEY - THIS IS NOT YET VALIDATED AGAINST THE sequelize.sync() SCHEMA

/**
 * Remove unique constraint on Configuration.key
 */

export async function up({
  context: { queryInterface, DataTypes },
}: MigrationParams<MigrationContext>) {
  await queryInterface.createTable("notifications", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      autoIncrementIdentity: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      index: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    send_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sound: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payload_presentation: {
      type: DataTypes.ENUM(Object.values(NotificationPayloadPresentationType)),
      allowNull: true,
    },
    payload_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payload_title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    payload_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  await queryInterface.createTable("person_notifications", {
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notification_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  await queryInterface.addIndex("person_notifications", ["person_id"]);
  await queryInterface.addIndex("person_notifications", ["notification_id"]);

  await queryInterface.addConstraint("person_notifications", {
    fields: ["person_id"],
    type: "foreign key",
    name: "person_notifications_person_id_fkey",
    references: {
      table: "people",
      field: "id",
    },
    onDelete: "cascade",
    onUpdate: "cascade",
  });

  await queryInterface.addConstraint("person_notifications", {
    fields: ["notification_id"],
    type: "foreign key",
    name: "person_notifications_notification_id_fkey",
    references: {
      table: "notifications",
      field: "id",
    },
    onDelete: "cascade",
    onUpdate: "cascade",
  });
}
