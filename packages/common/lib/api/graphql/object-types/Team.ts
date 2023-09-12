import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { DbRole } from "../../../index.js";

import type { PersonResource } from "./Person.js";
import type { PointEntryResource } from "./PointEntry.js";
import { Resource } from "./Resource.js";

export enum TeamType {
  Spirit = "Spirit",
  Morale = "Morale",
}

// Registering the TeamType enum with TypeGraphQL
registerEnumType(TeamType, {
  name: "TeamType",
  description: "Types of teams",
});

@ObjectType()
export class TeamResource extends Resource {
  @Field(() => ID)
  teamId!: string;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => DbRole)
  visibility!: DbRole;
  @Field(() => [String])
  members!: (PersonResource | string)[];
  @Field(() => [String])
  captains!: (PersonResource | string)[];
  @Field(() => [String])
  pointEntries!: (PointEntryResource | string)[];

  public getUniqueId(): string {
    return this.teamId;
  }

  public static init(init: Partial<TeamResource>) {
    return TeamResource.doInit(init);
  }
}
