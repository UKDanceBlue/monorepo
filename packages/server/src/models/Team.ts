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
import type { MarathonYearString } from "@ukdanceblue/common";
import { TeamLegacyStatus, TeamResource, TeamType } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import type { MembershipModel } from "./Membership.js";
import type { PointEntryModel } from "./PointEntry.js";

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
  public declare legacyStatus: TeamLegacyStatus;
  public declare marathonYear: MarathonYearString;
  public declare persistentIdentifier: CreationOptional<string | null>;

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

  public toResource(): TeamResource {
    return TeamResource.init({
      uuid: this.uuid,
      name: this.name,
      type: this.type,
      legacyStatus: this.legacyStatus,
      marathonYear: this.marathonYear,
      persistentIdentifier: this.persistentIdentifier,
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
    legacyStatus: {
      type: DataTypes.ENUM(Object.values(TeamLegacyStatus)),
      allowNull: false,
    },
    marathonYear: {
      type: DataTypes.STRING(4),
      allowNull: false,
      validate: {
        is: /^DB\d{2}$/,
      },
    },
    persistentIdentifier: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize: sequelizeDb,
    name: {
      singular: "team",
      plural: "teams",
    },
    modelName: "Team",
    hooks: {
      async beforeDestroy(instance, options) {
        const memberships = await instance.getMemberships(options);
        await Promise.all(memberships.map((m) => m.destroy(options)));
        const pointEntries = await instance.getPointEntries(options);
        await Promise.all(pointEntries.map((p) => p.destroy(options)));
      },
      async beforeRestore(instance, options) {
        const memberships = await instance.getMemberships({
          ...options,
          paranoid: false,
        });
        await Promise.all(memberships.map((m) => m.restore(options)));
        const pointEntries = await instance.getPointEntries({
          ...options,
          paranoid: false,
        });
        await Promise.all(pointEntries.map((p) => p.restore(options)));
      },
    },
  }
);
