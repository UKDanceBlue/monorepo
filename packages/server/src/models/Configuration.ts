import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { ConfigurationResource } from "@ukdanceblue/common";
import { DateTime } from "luxon";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";

export class ConfigurationModel extends BaseModel<
  InferAttributes<ConfigurationModel>,
  InferCreationAttributes<ConfigurationModel>
> {
  public declare readonly id: CreationOptional<number>;

  public declare readonly uuid: CreationOptional<string>;

  public declare key: string;

  public declare value: string;

  public declare validAfter: Date | null;

  public declare validUntil: Date | null;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  public toResource(): ConfigurationResource {
    return ConfigurationResource.init({
      uuid: this.uuid,
      key: this.key,
      value: this.value,
      validAfter: this.validAfter ? DateTime.fromJSDate(this.validAfter) : null,
      validUntil: this.validUntil ? DateTime.fromJSDate(this.validUntil) : null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}

ConfigurationModel.init(
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
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    validAfter: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeDb,
    paranoid: false,
    name: {
      singular: "configuration",
      plural: "configurations",
    },
    modelName: "Configuration",
  }
);
