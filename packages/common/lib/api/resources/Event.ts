import { Field, ID, ObjectType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";
import { IntervalISO } from "../types/IntervalISO.js";

import { Resource, TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class EventNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => [EventOccurrenceNode])
  occurrences!: EventOccurrenceNode[];
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  summary!: string | null;
  @Field(() => String, { nullable: true })
  description!: string | null;
  @Field(() => String, { nullable: true })
  location!: string | null;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: Partial<EventNode>) {
    return EventNode.doInit(init);
  }
}

@ObjectType({
  implements: [],
})
export class EventOccurrenceNode extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => IntervalISO)
  interval!: IntervalISO;
  @Field(() => Boolean)
  fullDay!: boolean;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<EventOccurrenceNode>) {
    return EventOccurrenceNode.doInit(init);
  }
}

export const { EventConnection, EventEdge, EventResult } = createNodeClasses(
  EventNode,
  "Event"
);
