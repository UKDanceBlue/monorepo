import { DateTimeResolver } from "graphql-scalars";
import { Field, ID, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class MarathonResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  year!: string;
  @Field(() => DateTimeResolver)
  startDate!: Date;
  @Field(() => DateTimeResolver)
  endDate!: Date;
}
