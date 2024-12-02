import { Field, ID, ObjectType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { IntervalISO } from "../types/IntervalISO.js";
import { Resource, TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class EventNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
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
    return this.id.id;
  }

  public static init(init: {
    id: string;
    title: string;
    summary?: string | undefined | null;
    description?: string | undefined | null;
    location?: string | undefined | null;
    updatedAt?: Date | undefined | null;
    createdAt?: Date | undefined | null;
    occurrences: EventOccurrenceNode[];
  }) {
    return this.createInstance().withValues(init);
  }
}

@ObjectType({
  implements: [],
})
export class EventOccurrenceNode extends Resource {
  @Field(() => ID)
  id!: string;
  @Field(() => IntervalISO)
  interval!: IntervalISO;
  @Field(() => Boolean)
  fullDay!: boolean;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: {
    id: string;
    interval: IntervalISO;
    fullDay: boolean;
  }) {
    const resource = this.createInstance();
    resource.id = init.id;
    resource.interval = init.interval;
    resource.fullDay = init.fullDay;
    return resource;
  }
}

export const { EventConnection, EventEdge, EventResult } = createNodeClasses(
  EventNode,
  "Event"
);
