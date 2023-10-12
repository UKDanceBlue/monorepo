import type {
  Association,
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
// import { DeviceResource } from "@ukdanceblue/common";
import { DeviceResource } from "@ukdanceblue/common";
import { DateTime } from "luxon";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import { PersonModel } from "./Person.js";

export class DeviceModel extends BaseModel<
  InferAttributes<DeviceModel>,
  InferCreationAttributes<DeviceModel>
> {
  declare id: CreationOptional<number>;
  declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  declare expoPushToken: string | null;

  declare createLastUser: BelongsToCreateAssociationMixin<PersonModel>;
  declare getLastUser: BelongsToGetAssociationMixin<PersonModel>;
  declare lastUser: NonAttribute<PersonModel | null>;
  declare lastUserId: ForeignKey<PersonModel["id"]> | null;

  declare lastLogin: Date | null;

  declare static associations: {
    lastUser: Association<DeviceModel, PersonModel>;
  };

  public toResource(): DeviceResource {
    return DeviceResource.init({
      uuid: this.uuid,
      expoPushToken: this.expoPushToken ?? null,
      // lastUser: this.lastUser?.toResource() ?? null,
      lastLogin:
        this.lastLogin == null ? null : DateTime.fromJSDate(this.lastLogin),
      createdAt: this.createdAt == null ? null : this.createdAt,
      updatedAt: this.updatedAt == null ? null : this.updatedAt,
    });
  }
}

DeviceModel.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    expoPushToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        is: /^Expo(nent)?PushToken\[.{23}]$/,
      },
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeDb,
    paranoid: false,
    name: {
      singular: "device",
      plural: "devices",
    },
    modelName: "Device",
  }
);

DeviceModel.belongsTo(PersonModel, {
  as: "lastUser",
  foreignKey: "lastUserId",
});
