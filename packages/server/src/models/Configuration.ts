import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { ConfigurationResource } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import { BaseModel } from "./BaseModel.js";
import type { CoreProperty } from "./intermediate.js";

export class ConfigurationModel extends BaseModel<
  InferAttributes<ConfigurationModel>,
  InferCreationAttributes<ConfigurationModel>
> {
  public declare id: CreationOptional<number>;

  public declare key: string;
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

export class ConfigurationIntermediate extends IntermediateClass<
  ConfigurationResource,
  ConfigurationIntermediate
> {
  public declare id: CoreProperty<number>;
  public declare key: CoreProperty<string>;

  constructor(configuration: ConfigurationModel) {
    super(["id", "key"], []);
    this.id = configuration.id!;
    this.key = configuration.key;
  }

  public toResource(): ConfigurationResource {
    if (this.hasCoreProperties()) {
      return ConfigurationResource.init({
        key: this.key,
      });
    } else {
      throw new Error("Cannot convert to resource");
    }
  }
}
