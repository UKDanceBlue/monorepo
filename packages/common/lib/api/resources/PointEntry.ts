import { Field, ID, Int, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class PointEntryResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String, { nullable: true })
  comment!: string | null;
  @Field(() => Int)
  points!: number;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<PointEntryResource>) {
    return PointEntryResource.doInit(init);
  }
}
