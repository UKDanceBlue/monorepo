import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes, Model } from "@sequelize/core";
import { GraphQLResource } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";
import { generators } from "openid-client";

import { sequelizeDb } from "../data-source.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import type { CoreProperty, ImportantProperty } from "./intermediate.js";

export class LoginFlowSessionModel extends Model<
  InferAttributes<LoginFlowSessionModel>,
  InferCreationAttributes<LoginFlowSessionModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  codeVerifier!: CreationOptional<string>;

  redirectToAfterLogin!: string | null;
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

export class LoginFlowSessionIntermediate extends IntermediateClass<
  GraphQLResource.LoginFlowSessionResource,
  LoginFlowSessionIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;
  public createdAt?: ImportantProperty<Date>;
  public codeVerifier?: ImportantProperty<string>;
  public redirectToAfterLogin?: ImportantProperty<string>;

  constructor() {
    super(
      ["id", "uuid"],
      ["createdAt", "codeVerifier", "redirectToAfterLogin"]
    );
  }

  toResource(): GraphQLResource.LoginFlowSessionResource {
    if (!this.hasImportantProperties()) {
      throw new Error(
        "Cannot convert LoginFlowSessionIntermediate to LoginFlowSessionResource: missing properties"
      );
    }

    return GraphQLResource.LoginFlowSessionResource.init({
      sessionId: this.uuid,
      creationDate: DateTime.fromJSDate(this.createdAt),
      codeVerifier: this.codeVerifier,
      redirectToAfterLogin: new URL(this.redirectToAfterLogin),
    });
  }
}
