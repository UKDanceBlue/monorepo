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
import { IntermediateClass } from "../lib/modelTypes.js";

import { BaseModel } from "./BaseModel.js";
import { PersonIntermediate, PersonModel } from "./Person.js";
import type { CoreProperty } from "./intermediate.js";

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

export class DeviceIntermediate extends IntermediateClass<
  DeviceResource,
  DeviceIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;

  public expoPushToken?: string | null;

  public lastUser?: PersonIntermediate | null;

  public lastLogin?: Date | null;

  constructor(device: DeviceModel) {
    super(["id", "uuid"], []);
    this.id = device.id;
    this.uuid = device.uuid;
    this.expoPushToken = device.expoPushToken;
    this.lastUser =
      device.lastUser == null ? null : new PersonIntermediate(device.lastUser);
    this.lastLogin = device.lastLogin;

    this.createdAt = device.createdAt;
    this.updatedAt = device.updatedAt;
  }

  public toResource(): DeviceResource {
    if (this.hasImportantProperties()) {
      return DeviceResource.init({
        uuid: this.uuid,
        expoPushToken: this.expoPushToken ?? null,
        lastUser: this.lastUser?.toResource() ?? null,
        lastLogin:
          this.lastLogin == null ? null : DateTime.fromJSDate(this.lastLogin),
        createdAt: this.createdAt == null ? null : this.createdAt,
        updatedAt: this.updatedAt == null ? null : this.updatedAt,
      });
    } else {
      throw new Error(
        "Cannot convert incomplete DeviceIntermediate to DeviceResource"
      );
    }
  }
}
