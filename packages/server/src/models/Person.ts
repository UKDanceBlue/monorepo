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
  CommitteeRole,
  DbRole,
  PersonResource,
  RoleResource,
} from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { roleToAuthorization } from "../lib/auth/role.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import { BaseModel } from "./BaseModel.js";
import type { MembershipModel } from "./Membership.js";
import {
  MembershipIntermediate,
  MembershipPositionType,
} from "./Membership.js";
import { TeamIntermediate } from "./Team.js";
import type {
  CoreProperty,
  CoreRequired,
  ImportantProperty,
} from "./intermediate.js";

export class PersonModel extends BaseModel<
  InferAttributes<PersonModel>,
  InferCreationAttributes<PersonModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare firstName: string | null;

  public declare lastName: string | null;

  public declare email: string;

  public declare linkblue: string | null;

  public declare authIds: Partial<Record<AuthSource, string>>;

  public declare dbRole: CreationOptional<DbRole>;

  public declare committeeRole: CommitteeRole | null;

  public declare committeeName: string | null;

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
    firstName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    linkblue: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      type: DataTypes.TEXT,
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
  }
);

export class PersonIntermediate extends IntermediateClass<
  PersonResource,
  PersonIntermediate
> {
  public id?: CoreProperty<number>;
  public uuid?: CoreProperty<string>;
  public firstName?: string | null;
  public lastName?: string | null;
  public email?: ImportantProperty<string>;
  public linkblue?: string | null;
  public authIds?: ImportantProperty<Partial<Record<AuthSource, string>>>;
  public dbRole?: ImportantProperty<DbRole>;
  public committeeRole?: CommitteeRole | null;
  public committeeName?: string | null;
  public memberships?: MembershipIntermediate[];

  constructor(init: Partial<PersonModel>) {
    super(["id", "uuid"], ["authIds", "dbRole", "email"]);
    if (init.id !== undefined) {
      this.id = init.id;
    }
    if (init.uuid !== undefined) {
      this.uuid = init.uuid;
    }
    if (init.firstName !== undefined) {
      this.firstName = init.firstName;
    }
    if (init.lastName !== undefined) {
      this.lastName = init.lastName;
    }
    if (init.email !== undefined) {
      this.email = init.email;
    }
    if (init.linkblue !== undefined) {
      this.linkblue = init.linkblue;
    }
    if (init.authIds !== undefined) {
      this.authIds = init.authIds;
    }
    if (init.dbRole !== undefined) {
      this.dbRole = init.dbRole;
    }
    if (init.committeeRole !== undefined) {
      this.committeeRole = init.committeeRole;
    }
    if (init.committeeName !== undefined) {
      this.committeeName = init.committeeName;
    }
    if (init.memberships !== undefined) {
      this.memberships = init.memberships.map(
        (membership) => new MembershipIntermediate(membership)
      );
    }
  }

  get role(): NonAttribute<RoleResource> {
    if (this.dbRole === undefined) {
      throw new Error("PersonIntermediate was not initialized with DB role");
    }

    const roleInit: Partial<RoleResource> = {
      dbRole: this.dbRole,
    };
    if (this.committeeRole !== undefined) {
      roleInit.committeeRole = this.committeeRole;
    }
    if (this.committeeName !== undefined) {
      roleInit.committee = this.committeeName;
    }
    return RoleResource.init(roleInit);
  }

  getMemberOf(): CoreRequired<TeamIntermediate>[] {
    if (this.memberships === undefined) {
      throw new Error(
        "PersonIntermediate was not initialized with memberships"
      );
    }
    const memberOf: CoreRequired<TeamIntermediate>[] = [];
    for (const membership of this.memberships) {
      if (membership.team === undefined) {
        throw new Error("MembershipIntermediate was not initialized with team");
      }
      const team = new TeamIntermediate(membership.team);
      if (team.hasCoreProperties()) {
        memberOf.push(team);
      } else {
        throw new Error("TeamIntermediate is not complete");
      }
    }
    return memberOf;
  }

  getCaptainOf(): CoreRequired<TeamIntermediate>[] {
    if (this.memberships === undefined) {
      throw new Error(
        "PersonIntermediate was not initialized with memberships"
      );
    }
    const captainOf: CoreRequired<TeamIntermediate>[] = [];
    for (const membership of this.memberships) {
      if (membership.position === MembershipPositionType.Captain) {
        if (membership.team === undefined) {
          throw new Error(
            "MembershipIntermediate was not initialized with team"
          );
        }
        const team = new TeamIntermediate(membership.team);
        if (team.hasCoreProperties()) {
          captainOf.push(team);
        } else {
          throw new Error("TeamIntermediate is not complete");
        }
      }
    }
    return captainOf;
  }

  toResource(): PersonResource {
    if (!this.hasImportantProperties()) {
      throw new Error("PersonIntermediate is not complete");
    }

    return PersonResource.init({
      personId: this.uuid,
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      authIds: this.authIds,
      email: this.email,
      linkblue: this.linkblue ?? null,
      memberOf: this.getMemberOf().map((team) => team.toResource()),
      captainOf: this.getCaptainOf().map((team) => team.toResource()),
      // pointEntries: [],
      role: this.role,
    });
  }

  toUserData(): UserData {
    if (!this.hasImportantProperties()) {
      throw new Error("PersonIntermediate is not complete");
    }

    const userData: UserData = {
      userId: this.uuid,
      auth: roleToAuthorization(this.role),
      captainOfTeamIds: this.getCaptainOf().map((team) => team.uuid),
      teamIds: this.getMemberOf().map((team) => team.uuid),
    };
    return userData;
  }
}
