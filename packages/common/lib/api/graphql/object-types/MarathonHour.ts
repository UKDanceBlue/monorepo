import { DateTimeResolver } from "graphql-scalars";
import { Field, ID, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class MarathonHourResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  details?: string | null;
  @Field(() => DateTimeResolver)
  shownStartingAt!: Date;
  @Field(() => String)
  durationInfo!: string;
}
