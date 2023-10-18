import type {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { EventResource } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import type { EventOccurrenceModel } from "./EventOccurrence.js";
import type { ImageModel } from "./Image.js";

export class EventModel extends BaseModel<
  InferAttributes<EventModel>,
  InferCreationAttributes<EventModel>
> {
  public declare id: CreationOptional<number>;
  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare title: string;

  public declare summary: string | null;

  public declare description: string | null;

  public declare location: string | null;

  public declare occurrences?: NonAttribute<EventOccurrenceModel[]>;
  public declare getOccurrences: HasManyGetAssociationsMixin<EventOccurrenceModel>;
  public declare createOccurrence: HasManyCreateAssociationMixin<EventOccurrenceModel>;
  public declare countOccurrences: HasManyCountAssociationsMixin<EventOccurrenceModel>;
  public declare addOccurrence: HasManyAddAssociationMixin<
    EventOccurrenceModel,
    EventOccurrenceModel["id"]
  >;
  public declare addOccurrences: HasManyAddAssociationsMixin<
    EventOccurrenceModel,
    EventOccurrenceModel["id"]
  >;
  public declare removeOccurrence: HasManyRemoveAssociationMixin<
    EventOccurrenceModel,
    EventOccurrenceModel["id"]
  >;
  public declare setOccurrences: HasManySetAssociationsMixin<
    EventOccurrenceModel,
    EventOccurrenceModel["id"]
  >;
  public declare removeOccurrences: HasManyRemoveAssociationsMixin<
    EventOccurrenceModel,
    EventOccurrenceModel["id"]
  >;
  public declare hasOccurrence: HasManyHasAssociationMixin<
    EventOccurrenceModel,
    EventOccurrenceModel["id"]
  >;
  public declare hasOccurrences: HasManyHasAssociationsMixin<
    EventOccurrenceModel,
    EventOccurrenceModel["id"]
  >;

  public declare images?: NonAttribute<ImageModel[]>;
  public declare createImage: BelongsToManyCreateAssociationMixin<ImageModel>;
  public declare getImages: BelongsToManyGetAssociationsMixin<ImageModel>;
  public declare setImages: BelongsToManySetAssociationsMixin<
    ImageModel,
    ImageModel["id"]
  >;
  public declare addImage: BelongsToManyAddAssociationMixin<
    ImageModel,
    ImageModel["id"]
  >;
  public declare addImages: BelongsToManyAddAssociationsMixin<
    ImageModel,
    ImageModel["id"]
  >;
  public declare removeImage: BelongsToManyRemoveAssociationMixin<
    ImageModel,
    ImageModel["id"]
  >;
  public declare removeImages: BelongsToManyRemoveAssociationsMixin<
    ImageModel,
    ImageModel["id"]
  >;
  public declare hasImage: BelongsToManyHasAssociationMixin<
    ImageModel,
    ImageModel["id"]
  >;
  public declare hasImages: BelongsToManyHasAssociationsMixin<
    ImageModel,
    ImageModel["id"]
  >;
  public declare countImages: BelongsToManyCountAssociationsMixin<ImageModel>;

  public toResource(): EventResource {
    if (!this.occurrences) {
      throw new Error(
        "EventModel.toResource() requires occurrences to be loaded"
      );
    }

    return EventResource.init({
      title: this.title,
      summary: this.summary ?? null,
      description: this.description ?? null,
      location: this.location ?? null,
      occurrences: this.occurrences.map((occurrence) =>
        occurrence.toResource()
      ),
      // images,
      uuid: this.uuid,
      createdAt:
        (this as Partial<typeof this>).createdAt == null
          ? null
          : this.createdAt,
      updatedAt:
        (this as Partial<typeof this>).updatedAt == null
          ? null
          : this.updatedAt,
    });
  }
}

EventModel.init(
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
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeDb,
    name: {
      singular: "event",
      plural: "events",
    },
    modelName: "Event",
  }
);
