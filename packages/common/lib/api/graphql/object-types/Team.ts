import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { DbRole } from "../../../index.js";
import { MarathonYearString } from "../../SimpleTypes.js";

import { Resource } from "./Resource.js";

export const TeamType = {
  Spirit: "Spirit",
  Morale: "Morale",
  Committee: "Committee",
} as const;
export type TeamType = (typeof TeamType)[keyof typeof TeamType];

// Registering the TeamType enum with TypeGraphQL
registerEnumType(TeamType, {
  name: "TeamType",
  description: "Types of teams",
});

export const TeamLegacyStatus = {
  NewTeam: "NewTeam",
  ReturningTeam: "ReturningTeam",
} as const;
export type TeamLegacyStatus =
  (typeof TeamLegacyStatus)[keyof typeof TeamLegacyStatus];

// Registering the TeamLegacyStatus enum with TypeGraphQL
registerEnumType(TeamLegacyStatus, {
  name: "TeamLegacyStatus",
  description: "New Team vs Returning Team",
});

@ObjectType()
export class TeamResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;
  @Field(() => DbRole)
  visibility!: DbRole;
  @Field(() => String)
  marathonYear!: MarathonYearString;

  @Field(() => String, { nullable: true })
  persistentIdentifier!: string | null; // TODO: Secure this field, committee only

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<TeamResource>) {
    return TeamResource.doInit(init);
  }
}
