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
import { DataTypes, Model } from "@sequelize/core";
// import type { ImageResource } from "@ukdanceblue/common";
// import { EventResource } from "@ukdanceblue/common";
import type { ImageResource } from "@ukdanceblue/common";
import { EventResource } from "@ukdanceblue/common";
import type { Duration } from "luxon";

import { sequelizeDb } from "../data-source.js";
import { DurationDataType } from "../lib/customdatatypes/Duration.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import type { EventOccurrenceModel } from "./EventOccurrence.js";
import { EventOccurrenceIntermediate } from "./EventOccurrence.js";
import type { ImageModel } from "./Image.js";
import { ImageIntermediate } from "./Image.js";
import type { CoreProperty, ImportantProperty } from "./intermediate.js";

export class EventModel extends Model<
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

  public declare duration: Duration | null;

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
    duration: {
      type: DurationDataType,
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

export class EventIntermediate extends IntermediateClass<
  EventResource,
  EventIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;
  public title?: ImportantProperty<string>;
  public summary?: string | null;
  public description?: string | null;
  public location?: string | null;
  public occurrences?: ImportantProperty<EventOccurrenceIntermediate[]>;
  public duration?: Duration | null;
  public images?: ImageIntermediate[] | string[];

  constructor(model: Partial<EventModel>) {
    super(["id", "uuid"], ["title", "occurrences"]);
    if (model.id !== undefined) {
      this.id = model.id;
    }
    if (model.uuid !== undefined) {
      this.uuid = model.uuid;
    }
    if (model.title !== undefined) {
      this.title = model.title;
    }
    if (model.summary !== undefined) {
      this.summary = model.summary;
    }
    if (model.description !== undefined) {
      this.description = model.description;
    }
    if (model.location !== undefined) {
      this.location = model.location;
    }
    if (model.occurrences !== undefined) {
      this.occurrences = model.occurrences.map(
        (occurrence) => new EventOccurrenceIntermediate(occurrence)
      );
    }
    if (model.duration !== undefined) {
      this.duration = model.duration;
    }
    if (model.images !== undefined) {
      this.images = model.images.map((image) => new ImageIntermediate(image));
    }
  }

  public toResource(): EventResource {
    if (!this.hasImportantProperties()) {
      throw new Error("Cannot convert incomplete Event to Resource");
    }

    let images: string[] | ImageResource[] | null = null;
    if (this.images != null) {
      if (typeof this.images[0] === "string") {
        images = [] as string[];
        for (const image of this.images as string[]) {
          images.push(image);
        }
      } else {
        for (const image of this.images as ImageIntermediate[]) {
          images = [] as ImageResource[];
          images.push(image.toResource());
        }
      }
    }

    return EventResource.init({
      title: this.title,
      summary: this.summary ?? null,
      description: this.description ?? null,
      location: this.location ?? null,
      occurrences: this.occurrences.map((occurrence) =>
        occurrence.toResource()
      ),
      duration: this.duration ?? null,
      images,
      eventId: this.uuid,
    });
  }
}
