import { Interval } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateRangeScalar } from "../custom-scalars/DateRangeScalar.js";

import { Resource } from "./Resource.js";

@ObjectType()
export class EventResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => [EventOccurrenceResource])
  occurrences!: EventOccurrenceResource[];
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

@ObjectType()
export class EventOccurrenceResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => DateRangeScalar)
  occurrence!: Interval;
  @Field(() => Boolean)
  fullDay!: boolean;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<EventOccurrenceResource>) {
    return EventOccurrenceResource.doInit(init);
  }
}
