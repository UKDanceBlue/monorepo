import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { LoginFlowSessionResource } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import { generators } from "openid-client";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";

export class LoginFlowSessionModel extends BaseModel<
  InferAttributes<LoginFlowSessionModel>,
  InferCreationAttributes<LoginFlowSessionModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  codeVerifier!: CreationOptional<string>;

  redirectToAfterLogin!: string | null;

  toResource(): LoginFlowSessionResource {
    return LoginFlowSessionResource.init({
      uuid: this.uuid,
      creationDate: DateTime.fromJSDate(this.createdAt),
      codeVerifier: this.codeVerifier,
      redirectToAfterLogin: this.redirectToAfterLogin
        ? new URL(this.redirectToAfterLogin)
        : null,
      createdAt: this.createdAt,
      updatedAt:
        (this as Partial<typeof this>).updatedAt == null
          ? null
          : this.updatedAt,
    });
  }
}

LoginFlowSessionModel.init(
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
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    codeVerifier: {
      type: DataTypes.STRING(128),
      defaultValue: () => generators.codeVerifier(128),
    },
    redirectToAfterLogin: {
      type: DataTypes.TEXT, // Not necessarily a full URL, could be just a path
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeDb,
    paranoid: false,
    name: {
      singular: "loginFlowSession",
      plural: "loginFlowSessions",
    },
    modelName: "LoginFlowSession",
  }
);
