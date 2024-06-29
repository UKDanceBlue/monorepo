import { Field, ObjectType, registerEnumType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

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
  implements: [Node],
})
export class TeamNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    name: string;
    type: TeamType;
    legacyStatus: TeamLegacyStatus;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    return TeamNode.createInstance().withValues(init);
  }
}

export const { TeamConnection, TeamEdge, TeamResult } = createNodeClasses(
  TeamNode,
  "Team"
);
