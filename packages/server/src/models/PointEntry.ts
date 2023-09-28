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
import { IntermediateClass } from "../lib/modelTypes.js";

import { BaseModel } from "./BaseModel.js";
import type { PersonModel } from "./Person.js";
import { PersonIntermediate } from "./Person.js";
import type { TeamModel } from "./Team.js";
import { TeamIntermediate } from "./Team.js";
import type { CoreProperty, ImportantProperty } from "./intermediate.js";

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

export class PointEntryIntermediate extends IntermediateClass<
  PointEntryResource,
  PointEntryIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;
  public type?: ImportantProperty<TeamType>;
  public comment?: string | null;
  public points?: ImportantProperty<number>;
  public personFromId?: number | null;
  public teamId?: ImportantProperty<number>;
  public personFrom?: PersonIntermediate | null;
  public team?: ImportantProperty<TeamIntermediate>;

  constructor(model: PointEntryModel) {
    super(["id", "uuid"], ["type", "team", "points", "teamId"]);
    this.id = model.id;
    this.uuid = model.uuid;
    this.type = model.type;
    this.comment = model.comment;
    this.points = model.points;
    this.personFromId = model.personFromId;
    this.teamId = model.teamId;
    this.personFrom =
      model.personFrom === null
        ? null
        : new PersonIntermediate(model.personFrom);
    this.team = new TeamIntermediate(model.team);
  }

  public hasNonOptionalProperties(): this is Required<PointEntryIntermediate> {
    return (
      this.id !== undefined &&
      this.uuid !== undefined &&
      this.type !== undefined &&
      this.comment !== undefined &&
      this.points !== undefined &&
      this.personFromId !== undefined &&
      this.teamId !== undefined &&
      this.personFrom !== undefined &&
      this.team !== undefined
    );
  }

  public toResource(): PointEntryResource {
    if (!this.hasNonOptionalProperties()) {
      throw new Error("PointEntryIntermediate is not complete");
    }

    return PointEntryResource.init({
      entryId: this.uuid,
      type: this.type,
      comment: this.comment,
      points: this.points,
      personFrom:
        this.personFrom === null ? null : this.personFrom.toResource(),
      team: this.team.toResource(),
    });
  }
}
