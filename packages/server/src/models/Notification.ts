import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import {
  NotificationPayload,
  NotificationPayloadPresentationType,
  NotificationResource,
} from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";

export class NotificationModel extends BaseModel<
  InferAttributes<NotificationModel>,
  InferCreationAttributes<NotificationModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: CreationOptional<string>;

  public declare title: string;

  public declare body: string;

  public declare sendTime: Date;

  public declare sound: string | null;

  public declare payloadPresentation: NotificationPayloadPresentationType | null;

  public declare payloadUrl: string | null;

  public declare payloadTitle: string | null;

  public declare payloadMessage: string | null;

  public declare readonly createdAt: NonAttribute<Date>;
  public declare readonly updatedAt: NonAttribute<Date>;

  public toResource(): NotificationResource {
    const notificationResource = NotificationResource.init({
      uuid: this.uuid,
      title: this.title,
      body: this.body,
      sendTime: this.sendTime,
      sound: this.sound,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });

    if (this.payloadPresentation != null) {
      const notificationPayload = new NotificationPayload();
      notificationPayload.presentation = this.payloadPresentation;
      if (this.payloadUrl != null) {
        notificationPayload.url = this.payloadUrl;
      }
      if (this.payloadTitle != null) {
        notificationPayload.title = this.payloadTitle;
      }
      if (this.payloadMessage != null) {
        notificationPayload.message = this.payloadMessage;
      }
      notificationResource.payload = notificationPayload;
    }

    return notificationResource;
  }
}

NotificationModel.init(
  {
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sendTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sound: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payloadPresentation: {
      type: DataTypes.ENUM(Object.values(NotificationPayloadPresentationType)),
      allowNull: true,
    },
    payloadUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payloadTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payloadMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeDb,
    timestamps: false,
    paranoid: false,
    name: {
      singular: "notification",
      plural: "notifications",
    },
    modelName: "Notification",
  }
);
