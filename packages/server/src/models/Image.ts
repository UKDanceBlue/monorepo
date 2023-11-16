import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { ImageResource } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import type { EventModel } from "./Event.js";

export class ImageModel extends BaseModel<
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

  public toResource(): ImageResource {
    return ImageResource.init({
      uuid: this.uuid,
      url: this.url ?? null,
      mimeType: this.mimeType,
      thumbHash: this.thumbHash?.toString("base64") ?? null,
      alt: this.alt ?? null,
      width: this.width,
      height: this.height,
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
        if (url != null) {
          return new URL(url);
        }
        return url;
      },
      set(value: URL | null) {
        if (value != null) {
          this.setDataValue("url", value.toString() as never);
        } else {
          this.setDataValue("url", null);
        }
      },
      allowNull: true,
      unique: true,
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
