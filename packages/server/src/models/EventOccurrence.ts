import type {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { DateTime } from "luxon";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import type { EventModel } from "./Event.js";

export class EventOccurrenceModel extends BaseModel<
  InferAttributes<EventOccurrenceModel>,
  InferCreationAttributes<EventOccurrenceModel>
> {
  public declare id: CreationOptional<number>;
  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare date: Date;

  public declare eventId: number;

  public declare event: NonAttribute<EventModel>;
  public declare getEvent: BelongsToGetAssociationMixin<EventModel>;
  public declare createEvent: BelongsToCreateAssociationMixin<EventModel>;

  public toResource(): DateTime {
    if (!this.date) {
      throw new Error(
        "EventOccurrenceIntermediate was not properly initialized"
      );
    }
    return DateTime.fromJSDate(this.date);
  }
}

EventOccurrenceModel.init(
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
    date: {
      type: DataTypes.DATE,
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
      singular: "eventOccurrence",
      plural: "eventOccurrences",
    },
    modelName: "EventOccurrence",
  }
);
