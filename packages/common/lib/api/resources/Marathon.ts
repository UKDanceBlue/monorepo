import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({
  implements: [TimestampedResource, Node],
})
export class MarathonResource extends TimestampedResource implements Node {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  year!: string;
  @Field(() => DateTimeISOResolver)
  startDate!: Date;
  get startDateDateTime(): DateTime {
    return dateTimeFromSomething(this.startDate);
  }
  @Field(() => DateTimeISOResolver)
  endDate!: Date;
  get endDateDateTime(): DateTime {
    return dateTimeFromSomething(this.endDate);
  }

  static init({
    uuid: id,
    year,
    startDate,
    endDate,
    createdAt,
    updatedAt,
  }: Omit<MarathonResource, "getUniqueId">): MarathonResource {
    return this.doInit({
      id,
      year,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    });
  }

  public getUniqueId(): string {
    return this.uuid;
  }
}

export const { MarathonConnection, MarathonEdge, MarathonResult } =
  createNodeClasses(MarathonResource, "Marathon");
