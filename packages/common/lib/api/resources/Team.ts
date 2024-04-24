import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";

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

@ObjectType({
  implements: [TimestampedResource, Node],
})
export class TeamResource extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: Partial<TeamResource>) {
    return TeamResource.doInit(init);
  }
}

export const { TeamConnection, TeamEdge, TeamResult } = createNodeClasses(
  TeamResource,
  "Team"
);
