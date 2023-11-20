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
import type { AuthSource, UserData } from "@ukdanceblue/common";
import {
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  PersonResource,
  RoleResource,
} from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { roleToAuthorization } from "../lib/auth/role.js";

import { BaseModel } from "./BaseModel.js";
import type { MembershipModel } from "./Membership.js";

export class PersonModel extends BaseModel<
  InferAttributes<PersonModel>,
  InferCreationAttributes<PersonModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare name: string | null;

  public declare email: string;

  public declare linkblue: string | null;

  public declare authIds: Partial<Record<AuthSource, string>> | null;

  public declare dbRole: CreationOptional<DbRole>;

  public declare committeeRole: CommitteeRole | null;

  public declare committeeName: CommitteeIdentifier | null; // TODO: consider removing, use relation to Team instead

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

  get role(): NonAttribute<RoleResource> {
    if ((this as Partial<typeof this>).dbRole === undefined) {
      throw new Error("PersonIntermediate was not initialized with DB role");
    }

    const roleInit: Partial<RoleResource> = {
      dbRole: this.dbRole,
    };
    if ((this as Partial<typeof this>).committeeRole !== undefined) {
      roleInit.committeeRole = this.committeeRole;
    }
    if ((this as Partial<typeof this>).committeeName !== undefined) {
      roleInit.committeeIdentifier = this.committeeName;
    }
    return RoleResource.init(roleInit);
  }

  toResource(): PersonResource {
    return PersonResource.init({
      uuid: this.uuid,
      name: this.name ?? null,
      authIds: Object.entries(this.authIds ?? {}).map(([source, value]) => ({
        source: source as keyof typeof this.authIds,
        value,
      })),
      email: this.email,
      linkblue: this.linkblue ?? null,
      role: this.role,
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

  toUserData(): UserData {
    const userData: UserData = {
      userId: this.uuid,
      auth: roleToAuthorization(this.role),
      // captainOfTeamIds: this.getCaptainOf().map((team) => team.uuid), TODO: reimplement
      // teamIds: this.getMemberOf().map((team) => team.uuid),
    };
    return userData;
  }
}

PersonModel.init(
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
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    linkblue: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true,
    },
    authIds: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    dbRole: {
      type: DataTypes.ENUM(Object.values(DbRole)),
      allowNull: false,
      defaultValue: DbRole.None,
    },
    committeeRole: {
      type: DataTypes.ENUM(Object.values(CommitteeRole)),
      allowNull: true,
    },
    committeeName: {
      type: DataTypes.ENUM(Object.values(CommitteeIdentifier)),
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeDb,
    name: {
      singular: "person",
      plural: "people",
    },
    modelName: "Person",
    hooks: {
      async afterDestroy(instance, options) {
        const memberships = await instance.getMemberships({
          transaction: options.transaction,
        });
        await Promise.all(
          memberships.map((membership) => membership.destroy(options))
        );
      },
    },
  }
);
