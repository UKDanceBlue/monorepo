import type { DateTime, Duration } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../custom-scalars/DateTimeScalar.js";
import { DurationScalar } from "../custom-scalars/DurationScalar.js";

import { Resource } from "./Resource.js";

@ObjectType()
export class EventResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => [DateTimeScalar])
  occurrences!: DateTime[];
  @Field(() => DurationScalar, { nullable: true })
  duration!: Duration | null;
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  summary!: string | null;
  @Field(() => String, { nullable: true })
  description!: string | null;
  @Field(() => String, { nullable: true })
  location!: string | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<EventResource>) {
    return EventResource.doInit(init);
  }
}
