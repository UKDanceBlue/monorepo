import { DateTime } from "luxon";
import { Field, ObjectType, registerEnumType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

export const TeamType = {
  Spirit: "Spirit",
  Morale: "Morale",
  Mini: "Mini",
} as const;
export type TeamType = (typeof TeamType)[keyof typeof TeamType];
export const TeamTypeValues: TeamType[] = Object.values(TeamType) as TeamType[];

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
export const TeamLegacyStatusValues: TeamLegacyStatus[] = Object.values(
  TeamLegacyStatus
) as TeamLegacyStatus[];

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

  @Field(() => String)
  text(): string {
    return this.name;
  }

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    name: string;
    type: TeamType;
    legacyStatus: TeamLegacyStatus;
    createdAt?: DateTime | undefined | null;
    updatedAt?: DateTime | undefined | null;
  }) {
    return TeamNode.createInstance().withValues(init);
  }
}

export const { TeamConnection, TeamEdge, TeamResult } = createNodeClasses(
  TeamNode,
  "Team"
);
