import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes, Model } from "@sequelize/core";
import { DbRole, GraphQLResource, TeamType } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import type { PointEntryModel } from "./PointEntry.js";
import { PointEntryIntermediate } from "./PointEntry.js";
import type { CoreProperty, ImportantProperty } from "./intermediate.js";

export class TeamModel extends Model<
  InferAttributes<TeamModel>,
  InferCreationAttributes<TeamModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare name: string;

  public declare type: TeamType;

  public declare visibility: CreationOptional<DbRole>;

  // TODO: convert to a memberships table that also stores the captain status
  // public declare members: PersonModel[];

  // public declare captains: PersonModel[];

  public declare pointEntries: NonAttribute<PointEntryModel[]>;
}

TeamModel.init(
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
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(Object.values(TeamType)),
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM(Object.values(DbRole)),
      defaultValue: DbRole.None,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeDb,
    name: {
      singular: "team",
      plural: "teams",
    },
    modelName: "Team",
  }
);

export class TeamIntermediate extends IntermediateClass<
  GraphQLResource.TeamResource,
  TeamIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;
  public name?: ImportantProperty<string>;
  public type?: ImportantProperty<TeamType>;
  public visibility?: ImportantProperty<DbRole>;
  public pointEntries?: ImportantProperty<PointEntryIntermediate[] | string[]>;

  constructor(team: TeamModel) {
    super(["id", "uuid"], ["name", "type", "visibility", "pointEntries"]);
    this.id = team.id;
    this.uuid = team.uuid;
    this.name = team.name;
    this.type = team.type;
    this.visibility = team.visibility;
    this.pointEntries = team.pointEntries.map(
      (pe) => new PointEntryIntermediate(pe)
    );
  }

  public toResource(): GraphQLResource.TeamResource {
    if (!this.hasImportantProperties()) {
      throw new Error("TeamIntermediate is not complete");
    }

    let pointEntries: string[] | GraphQLResource.PointEntryResource[];
    if (typeof this.pointEntries[0] === "string") {
      pointEntries = [] as string[];
      for (const pe of this.pointEntries) {
        pointEntries.push(pe as string);
      }
    } else {
      pointEntries = [] as GraphQLResource.PointEntryResource[];
      for (const pe of this.pointEntries) {
        pointEntries.push((pe as PointEntryIntermediate).toResource());
      }
    }

    return GraphQLResource.TeamResource.init({
      teamId: this.uuid,
      name: this.name,
      type: this.type,
      visibility: this.visibility,
      pointEntries,
      members: [],
      captains: [],
    });
  }
}
