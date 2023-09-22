import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes, Model } from "@sequelize/core";
import { ImageResource } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import type { EventModel } from "./Event.js";
import type { CoreProperty, ImportantProperty } from "./intermediate.js";

export class ImageModel extends Model<
  InferAttributes<ImageModel>,
  InferCreationAttributes<ImageModel>
> {
  public declare id: CreationOptional<number>;
  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare url: URL | null;

  public declare imageData: Buffer | null;

  public declare mimeType: string;

  public declare thumbHash: Buffer | null;

  public declare alt: string | null;

  public declare width: number;

  public declare height: number;

  private declare eventWithImages: EventModel[];
}

ImageModel.init(
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
    url: {
      type: DataTypes.TEXT,
      get(): URL | null {
        const url = this.getDataValue("url") as string | null;
        if (url != null) return new URL(url);
        return url;
      },
      set(value: URL | null) {
        if (value != null) this.setDataValue("url", value.toString() as never);
        else this.setDataValue("url", null);
      },
      allowNull: true,
    },
    imageData: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING(255), // The RFC guarantees a max of 127 characters on each side of the slash, making 255 the max length
      allowNull: true,
    },
    thumbHash: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    alt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    width: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeDb,
    name: {
      singular: "image",
      plural: "images",
    },
    modelName: "Image",
  }
);

export class ImageIntermediate extends IntermediateClass<
  ImageResource,
  ImageIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;
  public url?: URL | null;
  public imageData?: Buffer;
  public mimeType?: ImportantProperty<string>;
  public thumbHash?: Buffer | null;
  public alt?: string | null;
  public width?: ImportantProperty<number>;
  public height?: ImportantProperty<number>;

  constructor(model: Partial<ImageModel>) {
    super(["id", "uuid"], ["mimeType", "width", "height"]);
    if (model.id) this.id = model.id;
    if (model.uuid) this.uuid = model.uuid;
    if (model.url) this.url = model.url;
    if (model.imageData) this.imageData = model.imageData;
    if (model.mimeType) this.mimeType = model.mimeType;
    if (model.thumbHash) this.thumbHash = model.thumbHash;
    if (model.alt) this.alt = model.alt;
    if (model.width) this.width = model.width;
    if (model.height) this.height = model.height;
  }

  public toResource(): ImageResource {
    if (this.hasImportantProperties()) {
      return ImageResource.init({
        imageId: this.uuid,
        url: this.url ?? null,
        mimeType: this.mimeType,
        thumbHash: this.thumbHash?.toString("base64") ?? null,
        alt: this.alt ?? null,
        width: this.width,
        height: this.height,
      });
    } else {
      throw new Error("Image is not complete, cannot convert to resource");
    }
  }
}
