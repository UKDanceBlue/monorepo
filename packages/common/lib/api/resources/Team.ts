import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { AccessControl } from "../../authorization/accessControl.js";
import { AccessLevel } from "../../authorization/structures.js";
import * as SimpleTypes from "../../utility/primitive/SimpleTypes.js";

import { TimestampedResource } from "./Resource.js";

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
  DemoTeam: "DemoTeam",
} as const;
export type TeamLegacyStatus =
  (typeof TeamLegacyStatus)[keyof typeof TeamLegacyStatus];

// Registering the TeamLegacyStatus enum with TypeGraphQL
registerEnumType(TeamLegacyStatus, {
  name: "TeamLegacyStatus",
  description: "New Team vs Returning Team",
});

@ObjectType()
export class TeamResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;
  @Field(() => String)
  marathonYear!: SimpleTypes.MarathonYearString;

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Field(() => String, { nullable: true })
  persistentIdentifier!: string | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<TeamResource>) {
    return TeamResource.doInit(init);
  }
}
