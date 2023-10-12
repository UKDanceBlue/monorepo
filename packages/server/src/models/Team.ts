import type {
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
import type { PointEntryResource } from "@ukdanceblue/common";
import {
  DbRole,
  TeamResource,
  TeamType,
  isNonNullable,
} from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import { BaseModel } from "./BaseModel.js";
import type { MembershipModel } from "./Membership.js";
import {
  MembershipIntermediate,
  MembershipPositionType,
} from "./Membership.js";
import { PersonIntermediate } from "./Person.js";
import type { PointEntryModel } from "./PointEntry.js";
import { PointEntryIntermediate } from "./PointEntry.js";
import type { CoreProperty, ImportantProperty } from "./intermediate.js";

export class TeamModel extends BaseModel<
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

  public declare pointEntries: NonAttribute<PointEntryModel[]>;
  public declare addPointEntry: HasManyAddAssociationMixin<
    PointEntryModel,
    PointEntryModel["id"]
  >;
  public declare addPointEntries: HasManyAddAssociationsMixin<
    PointEntryModel,
    PointEntryModel["id"]
  >;
  public declare countPointEntries: HasManyCountAssociationsMixin<PointEntryModel>;
  public declare createPointEntry: HasManyCreateAssociationMixin<PointEntryModel>;
  public declare getPointEntries: HasManyGetAssociationsMixin<PointEntryModel>;
  public declare hasPointEntry: HasManyHasAssociationMixin<
    PointEntryModel,
    PointEntryModel["id"]
  >;
  public declare hasPointEntries: HasManyHasAssociationsMixin<
    PointEntryModel,
    PointEntryModel["id"]
  >;
  public declare removePointEntry: HasManyRemoveAssociationMixin<
    PointEntryModel,
    PointEntryModel["id"]
  >;
  public declare removePointEntries: HasManyRemoveAssociationsMixin<
    PointEntryModel,
    PointEntryModel["id"]
  >;
  public declare setPointEntries: HasManySetAssociationsMixin<
    PointEntryModel,
    PointEntryModel["id"]
  >;

  public declare memberships: NonAttribute<MembershipModel[]>;
  public declare getMemberships: HasManyGetAssociationsMixin<MembershipModel>;
  public declare hasMembership: HasManyHasAssociationMixin<
    MembershipModel,
    MembershipModel["id"]
  >;
  public declare hasMemberships: HasManyHasAssociationsMixin<
    MembershipModel,
    MembershipModel["id"]
  >;
  public declare countMemberships: HasManyCountAssociationsMixin<MembershipModel>;
  public declare addMembership: HasManyAddAssociationMixin<
    MembershipModel,
    MembershipModel["id"]
  >;
  public declare addMemberships: HasManyAddAssociationsMixin<
    MembershipModel,
    MembershipModel["id"]
  >;
  public declare removeMembership: HasManyRemoveAssociationMixin<
    MembershipModel,
    MembershipModel["id"]
  >;
  public declare removeMemberships: HasManyRemoveAssociationsMixin<
    MembershipModel,
    MembershipModel["id"]
  >;
  public declare createMembership: HasManyCreateAssociationMixin<MembershipModel>;
  public declare setMemberships: HasManySetAssociationsMixin<
    MembershipModel,
    MembershipModel["id"]
  >;
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
  TeamResource,
  TeamIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;
  public name?: ImportantProperty<string>;
  public type?: ImportantProperty<TeamType>;
  public visibility?: ImportantProperty<DbRole>;
  public pointEntries?: ImportantProperty<PointEntryIntermediate[] | string[]>;
  public memberships?: ImportantProperty<MembershipIntermediate[]>;

  constructor(model: TeamModel) {
    super(["id", "uuid"], ["name", "type", "visibility", "pointEntries"]);
    this.id = model.id;
    this.uuid = model.uuid;
    this.name = model.name;
    this.type = model.type;
    this.visibility = model.visibility;
    this.pointEntries = model.pointEntries.map(
      (pe) => new PointEntryIntermediate(pe)
    );
    this.memberships = model.memberships.map(
      (m) => new MembershipIntermediate(m)
    );

    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }

  public toResource(): TeamResource {
    if (!this.hasImportantProperties()) {
      throw new Error("TeamIntermediate is not complete");
    }

    let pointEntries: string[] | PointEntryResource[];
    if (typeof this.pointEntries[0] === "string") {
      pointEntries = [] as string[];
      for (const pe of this.pointEntries) {
        pointEntries.push(pe as string);
      }
    } else {
      pointEntries = [] as PointEntryResource[];
      for (const pe of this.pointEntries) {
        pointEntries.push((pe as PointEntryIntermediate).toResource());
      }
    }

    const members = this.memberships
      .map((m) =>
        m.person ? new PersonIntermediate(m.person).toResource() : null
      )
      .filter(isNonNullable);
    const captains = this.memberships
      .filter((m) => m.position === MembershipPositionType.Captain)
      .map((m) =>
        m.person ? new PersonIntermediate(m.person).toResource() : null
      )
      .filter(isNonNullable);

    return TeamResource.init({
      uuid: this.uuid,
      name: this.name,
      type: this.type,
      visibility: this.visibility,
      // pointEntries,
      // members,
      // captains,
      createdAt: this.createdAt == null ? null : this.createdAt,
      updatedAt: this.updatedAt == null ? null : this.updatedAt,
    });
  }
}
