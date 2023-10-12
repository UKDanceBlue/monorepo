import type {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes } from "@sequelize/core";
import { PointEntryResource, TeamType } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import type { PersonModel } from "./Person.js";
import type { TeamModel } from "./Team.js";

export class PointEntryModel extends BaseModel<
  InferAttributes<PointEntryModel>,
  InferCreationAttributes<PointEntryModel>
> {
  public declare id: CreationOptional<number>;
  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare type: TeamType;

  public declare comment: string;

  public declare points: number;

  public declare personFrom: NonAttribute<PersonModel | null>;
  public declare getPersonFrom: BelongsToGetAssociationMixin<PersonModel>;
  public declare setPersonFrom: BelongsToSetAssociationMixin<
    PersonModel,
    PersonModel["id"]
  >;
  public declare createPersonFrom: BelongsToCreateAssociationMixin<PersonModel>;
  public declare readonly personFromId: CreationOptional<number>;

  public declare team: NonAttribute<TeamModel>;
  public declare getTeam: BelongsToGetAssociationMixin<TeamModel>;
  public declare setTeam: BelongsToSetAssociationMixin<
    TeamModel,
    TeamModel["id"]
  >;
  public declare createTeam: BelongsToCreateAssociationMixin<TeamModel>;
  public declare readonly teamId: CreationOptional<number>;

  public toResource(): PointEntryResource {
    return PointEntryResource.init({
      uuid: this.uuid,
      type: this.type,
      comment: this.comment,
      points: this.points,
      // personFrom:
      //   this.personFrom === null ? null : this.personFrom.toResource(),
      // team: this.team.toResource(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}

PointEntryModel.init(
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
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    type: {
      type: DataTypes.ENUM(Object.values(TeamType)),
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    personFromId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeDb,
    paranoid: true,
    name: {
      plural: "pointEntries",
      singular: "pointEntry",
    },
    modelName: "PointEntry",
  }
);
