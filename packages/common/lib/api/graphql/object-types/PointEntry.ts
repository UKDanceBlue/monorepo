import { Field, ID, Int, ObjectType } from "type-graphql";

import { PersonResource } from "./Person.js";
import { Resource } from "./Resource.js";
import { TeamResource, TeamType } from "./Team.js";

@ObjectType()
export class PointEntryResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => String, { nullable: true })
  comment!: string | null;
  @Field(() => Int)
  points!: number;
  @Field(() => PersonResource, { nullable: true })
  personFrom!: PersonResource | null;
  @Field(() => TeamResource)
  team!: TeamResource;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<PointEntryResource>) {
    return PointEntryResource.doInit(init);
  }
}
