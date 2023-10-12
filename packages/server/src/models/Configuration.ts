import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { ConfigurationResource } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";

export class ConfigurationModel extends BaseModel<
  InferAttributes<ConfigurationModel>,
  InferCreationAttributes<ConfigurationModel>
> {
  public declare id: CreationOptional<number>;

  public declare key: string;

  public toResource(): ConfigurationResource {
    return ConfigurationResource.init({
      key: this.key,
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
  },
  {
    sequelize: sequelizeDb,
    timestamps: false,
    paranoid: false,
    name: {
      singular: "configuration",
      plural: "configurations",
    },
    modelName: "Configuration",
  }
);
