import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "@sequelize/core";
import { DataTypes, Model } from "@sequelize/core";
import type {
  AuthSource,
  UserData
} from "@ukdanceblue/common";
import {
  CommitteeRole,
  DbRole,
  GraphQLResource,
} from "@ukdanceblue/common";


import { sequelizeDb } from "../data-source.js";
import { roleToAuthorization } from "../lib/auth/role.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import type { TeamModel } from "./Team.js";
import { TeamIntermediate } from "./Team.js";
import type { CoreProperty, ImportantProperty } from "./intermediate.js";

export class PersonModel extends Model<
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

  public declare memberOf: NonAttribute<TeamModel[]>;

  public declare captainOf: NonAttribute<TeamModel[]>;
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
  GraphQLResource.PersonResource,
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
  public memberOf?: ImportantProperty<TeamIntermediate[]>;
  public captainOf?: ImportantProperty<TeamIntermediate[]>;

  constructor(init: Partial<PersonModel>) {
    super(
      ["id", "uuid"],
      ["authIds", "captainOf", "dbRole", "email", "memberOf"]
    );
    if (init.id !== undefined) this.id = init.id;
    if (init.uuid !== undefined) this.uuid = init.uuid;
    if (init.firstName !== undefined) this.firstName = init.firstName;
    if (init.lastName !== undefined) this.lastName = init.lastName;
    if (init.email !== undefined) this.email = init.email;
    if (init.linkblue !== undefined) this.linkblue = init.linkblue;
    if (init.authIds !== undefined) this.authIds = init.authIds;
    if (init.dbRole !== undefined) this.dbRole = init.dbRole;
    if (init.committeeRole !== undefined)
      this.committeeRole = init.committeeRole;
    if (init.committeeName !== undefined)
      this.committeeName = init.committeeName;
    if (init.memberOf !== undefined)
      this.memberOf = init.memberOf.map((t) => new TeamIntermediate(t));
    if (init.captainOf !== undefined)
      this.captainOf = init.captainOf.map((t) => new TeamIntermediate(t));
  }

  get role(): NonAttribute<GraphQLResource.RoleResource> {
    if (this.dbRole === undefined) {
      throw new Error("PersonIntermediate was not initialized with DB role");
    }

    const roleInit: Partial<GraphQLResource.RoleResource> = {
      dbRole: this.dbRole,
    };
    if (this.committeeRole !== undefined)
      roleInit.committeeRole = this.committeeRole;
    if (this.committeeName !== undefined)
      roleInit.committee = this.committeeName;
    return GraphQLResource.RoleResource.init(roleInit);
  }

  toResource(): GraphQLResource.PersonResource {
    if (!this.hasImportantProperties()) {
      throw new Error("PersonIntermediate is not complete");
    }

    return GraphQLResource.PersonResource.init({
      personId: this.uuid,
      firstName: this.firstName ?? null,
      lastName: this.lastName ?? null,
      authIds: this.authIds,
      email: this.email,
      linkblue: this.linkblue ?? null,
      memberOf: this.memberOf.map((team) => team.toResource()),
      captainOf: this.captainOf.map((team) => team.toResource()),
      // pointEntries: [],
      role: this.role,
    });
  }

  toUserData(): UserData {
    if (this.uuid === undefined) {
      throw new Error("PersonIntermediate was not initialized with UUID");
    }
    if (this.memberOf === undefined) {
      throw new Error("PersonIntermediate was not initialized with memberOf");
    }
    if (this.captainOf === undefined) {
      throw new Error("PersonIntermediate was not initialized with captainOf");
    }
    const userData: UserData = {
      userId: this.uuid,
      auth: roleToAuthorization(this.role),
    };
    userData.teamIds = this.memberOf.map((team) => team.uuid!);
    userData.captainOfTeamIds = this.captainOf.map((team) => team.uuid!);
    return userData;
  }
}
