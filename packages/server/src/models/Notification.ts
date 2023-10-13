import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { NotificationResource } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";

export class NotificationModel extends BaseModel<
  InferAttributes<NotificationModel>,
  InferCreationAttributes<NotificationModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: string;

  public toResource(): NotificationResource {
    return NotificationResource.init({
      uuid: this.uuid,
    });
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
