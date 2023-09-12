import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes, Model } from "@sequelize/core";
import { GraphQLResource } from "@ukdanceblue/db-app-common";

import { sequelizeDb } from "../data-source.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import type { CoreProperty } from "./intermediate.js";

export class ConfigurationModel extends Model<
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
  GraphQLResource.ConfigurationResource,
  ConfigurationIntermediate
> {
  public declare id: CoreProperty<number>;
  public declare key: CoreProperty<string>;

  constructor(configuration: ConfigurationModel) {
    super(["id", "key"], []);
    this.id = configuration.id!;
    this.key = configuration.key;
  }

  public toResource(): GraphQLResource.ConfigurationResource {
    if (this.hasCoreProperties()) {
      return GraphQLResource.ConfigurationResource.init({
        key: this.key,
      });
    } else {
      throw new Error("Cannot convert to resource");
    }
  }
}
