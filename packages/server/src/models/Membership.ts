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

import { sequelizeDb } from "../data-source.js";
import { IntermediateClass } from "../lib/modelTypes.js";

import { BaseModel } from "./BaseModel.js";
import type { PersonModel } from "./Person.js";
import type { TeamModel } from "./Team.js";
import type { CoreProperty } from "./intermediate.js";

export const MembershipPositionType = {
  Member: "Member",
  Captain: "Captain",
} as const;

export type MembershipPositionType =
  (typeof MembershipPositionType)[keyof typeof MembershipPositionType];

export class MembershipModel extends BaseModel<
  InferAttributes<MembershipModel>,
  InferCreationAttributes<MembershipModel>
> {
  public declare id: CreationOptional<number>;

  public declare uuid: CreationOptional<string>;

  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;

  public declare personId: number;
  public declare person?: NonAttribute<PersonModel>;
  public declare getPerson: BelongsToGetAssociationMixin<PersonModel>;
  public declare setPerson: BelongsToSetAssociationMixin<PersonModel, number>;
  public declare createPerson: BelongsToCreateAssociationMixin<PersonModel>;

  public declare teamId: number;
  public declare team?: NonAttribute<TeamModel>;
  public declare getTeam: BelongsToGetAssociationMixin<TeamModel>;
  public declare setTeam: BelongsToSetAssociationMixin<TeamModel, number>;
  public declare createTeam: BelongsToCreateAssociationMixin<TeamModel>;

  public declare position: MembershipPositionType;
}

MembershipModel.init(
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
    personId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.ENUM(...Object.values(MembershipPositionType)),
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeDb,
    name: {
      singular: "membership",
      plural: "memberships",
    },
    modelName: "Membership",
  }
);

export class MembershipIntermediate extends IntermediateClass<
  never,
  MembershipIntermediate
> {
  public id: CoreProperty<number>;
  public uuid: CoreProperty<string>;
  public position: CoreProperty<MembershipPositionType>;
  public person?: PersonModel;
  public team?: TeamModel;

  constructor(model: MembershipModel) {
    super(["id", "uuid", "position"], []);
    this.id = model.id;
    this.uuid = model.uuid;
    if (model.person) {
      this.person = model.person;
    }
    if (model.team) {
      this.team = model.team;
    }
    this.position = model.position;

    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }

  public toResource(): never {
    throw new Error("Method not implemented.");
  }
}

MembershipModel.addScope("captains", {
  where: {
    position: MembershipPositionType.Captain,
  },
});
