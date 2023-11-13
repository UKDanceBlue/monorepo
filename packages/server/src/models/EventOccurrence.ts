import type {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { EventOccurrenceResource, LuxonError } from "@ukdanceblue/common";
import { DateTime, Interval } from "luxon";

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

  public declare fullDay: boolean;
  public declare date: Date;
  public declare endDate: Date;

  public declare eventId: number;

  public declare event: NonAttribute<EventModel>;
  public declare getEvent: BelongsToGetAssociationMixin<EventModel>;
  public declare createEvent: BelongsToCreateAssociationMixin<EventModel>;

  public toResource(): EventOccurrenceResource {
    if (
      !(this as Partial<typeof this>).date ||
      !(this as Partial<typeof this>).endDate
    ) {
      throw new Error("EventOccurrence was not properly initialized");
    }

    const startDateTime = DateTime.fromJSDate(this.date);
    if (startDateTime.invalidReason) {
      throw new TypeError(`EventOccurrence.date is invalid`, {
        cause: new LuxonError(startDateTime),
      });
    }
    const endDateTime = DateTime.fromJSDate(this.endDate);
    if (endDateTime.invalidReason) {
      throw new TypeError(`EventOccurrence.endDate is invalid`, {
        cause: new LuxonError(endDateTime),
      });
    }
    const occurrence = Interval.fromDateTimes(startDateTime, endDateTime);
    if (occurrence.invalidReason) {
      throw new TypeError(
        `EventOccurrence.date and EventOccurrence.endDate do not form a valid interval`,
        { cause: new LuxonError(occurrence) }
      );
    }

    return EventOccurrenceResource.init({
      uuid: this.uuid,
      interval: occurrence,
      fullDay: this.fullDay,
    });
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
    fullDay: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
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
