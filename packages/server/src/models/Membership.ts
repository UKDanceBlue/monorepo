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
import { MembershipResource } from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";

import { BaseModel } from "./BaseModel.js";
import type { PersonModel } from "./Person.js";
import type { TeamModel } from "./Team.js";

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

  public toResource(): MembershipResource {
    return MembershipResource.init({
      uuid: this.uuid,
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
    });
  }
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

MembershipModel.addScope("captains", {
  where: {
    position: MembershipPositionType.Captain,
  },
});
