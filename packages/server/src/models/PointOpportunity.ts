import type {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { PointOpportunityResource, TeamType } from "@ukdanceblue/common";
import { DateTime } from "luxon";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import type { EventModel } from "./Event.js";

export class PointOpportunityModel extends BaseModel<
  InferAttributes<PointOpportunityModel>,
  InferCreationAttributes<PointOpportunityModel>
> {
  public declare id: CreationOptional<number>;
  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare name: string;
  public declare opportunityDate: Date | null;
  public declare type: TeamType;

  public declare eventId: number | null;

  public declare event: NonAttribute<EventModel | null>;
  public declare getEvent: BelongsToGetAssociationMixin<EventModel>;
  public declare createEvent: BelongsToCreateAssociationMixin<EventModel>;

  public toResource(): PointOpportunityResource {
    return PointOpportunityResource.init({
      uuid: this.uuid,
      name: this.name,
      opportunityDate: this.opportunityDate
        ? DateTime.fromJSDate(this.opportunityDate)
        : null,
      type: this.type,
    });
  }
}

PointOpportunityModel.init(
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
    deletedAt: DataTypes.DATE,
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    opportunityDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM({ values: Object.values(TeamType) }),
      allowNull: false,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeDb,
    timestamps: false,
    paranoid: false,
    name: {
      singular: "pointOpportunity",
      plural: "pointOpportunities",
    },
    modelName: "PointOpportunity",
  }
);
