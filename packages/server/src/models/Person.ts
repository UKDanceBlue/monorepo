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
import type { UserData } from "@ukdanceblue/common";
import {
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  MembershipPositionType,
  PersonResource,
  RoleResource,
} from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { roleToAuthorization } from "../lib/auth/role.js";
import { logError } from "../logger.js";

import { BaseModel } from "./BaseModel.js";
import { MembershipModel } from "./Membership.js";

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

  public declare committeeRole: CommitteeRole | null;

  public declare committeeName: CommitteeIdentifier | null;

  public async getDbRole(): Promise<DbRole> {
    if (this.authIds?.[AuthSource.None]) {
      return DbRole.None;
    } else if (this.authIds?.[AuthSource.Anonymous]) {
      return DbRole.Public;
    } else if (this.committeeName && this.committeeRole) {
      return DbRole.Committee;
    } else if (this.committeeName || this.committeeRole) {
      logError(
        "PersonModel.getDbRole() found only one of committeeName or committeeRole set"
      );
    } else if (
      this.authIds?.[AuthSource.UkyLinkblue] ||
      this.authIds?.[AuthSource.Demo]
    ) {
      const membershipCounts = await MembershipModel.count({
        attributes: ["position"],
        group: ["position"],
      });
      let captainCount = 0;
      let memberCount = 0;
      for (const { position, count } of membershipCounts) {
        if (position === MembershipPositionType.Captain) {
          captainCount = count;
        } else if (position === MembershipPositionType.Member) {
          memberCount = count;
        }
      }
      if (captainCount === 0 && memberCount === 0) {
        return DbRole.Public;
      } else if (captainCount > 0) {
        return DbRole.TeamCaptain;
      } else {
        return DbRole.TeamMember;
      }
    }

    return DbRole.Public;
  }

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

  async getRole(): Promise<RoleResource> {
    const roleInit: Partial<RoleResource> = {
      dbRole: await this.getDbRole(),
    };
    if ((this as Partial<typeof this>).committeeRole !== undefined) {
      roleInit.committeeRole = this.committeeRole;
    }
    if ((this as Partial<typeof this>).committeeName !== undefined) {
      roleInit.committeeIdentifier = this.committeeName;
    }
    return RoleResource.init(roleInit);
  }

  async toResource(): Promise<PersonResource> {
    return PersonResource.init({
      uuid: this.uuid,
      name: this.name ?? null,
      authIds: Object.entries(this.authIds ?? {}).map(([source, value]) => ({
        source: source as keyof typeof this.authIds,
        value,
      })),
      email: this.email,
      linkblue: this.linkblue ?? null,
      role: await this.getRole(),
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

  async toUserData(authSourceOverride?: AuthSource): Promise<UserData> {
    let authSource: AuthSource = AuthSource.None;
    if (authSourceOverride) {
      authSource = authSourceOverride;
    } else {
      const authSources = Object.keys(this.authIds ?? {}) as AuthSource[];
      if (authSources[0]) {
        authSource = authSources[0];
      } else if (authSources.length > 1) {
        for (const source of authSources) {
          if (source === AuthSource.UkyLinkblue) {
            authSource = source;
            break;
          } else if (
            source === AuthSource.Anonymous &&
            (authSource as AuthSource | undefined) !== AuthSource.UkyLinkblue
          ) {
            authSource = source;
          }
        }
      }
    }

    const memberships = await this.getMemberships({ scope: "withTeam" });

    const userData: UserData = {
      userId: this.uuid,
      auth: roleToAuthorization(await this.getRole()),
      captainOfTeamIds: memberships
        .filter(
          (membership) => membership.position === MembershipPositionType.Captain
        )
        .map((membership) => membership.team!.uuid),
      teamIds: memberships.map((membership) => membership.team!.uuid),
      authSource,
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
      async beforeDestroy(instance, options) {
        const memberships = await instance.getMemberships({
          transaction: options.transaction,
        });
        await Promise.all(
          memberships.map((membership) => membership.destroy(options))
        );
      },
      async beforeRestore(instance, options) {
        const memberships = await instance.getMemberships({
          ...options,
          paranoid: false,
        });
        await Promise.all(
          memberships.map((membership) => membership.restore(options))
        );
      },
    },
  }
);
