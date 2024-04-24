import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({
  implements: [TimestampedResource, Node],
})
export class MarathonHourNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  details?: string | null;
  @Field(() => DateTimeISOResolver)
  shownStartingAt!: Date;
  get shownStartingAtDateTime(): DateTime {
    return dateTimeFromSomething(this.shownStartingAt);
  }
  @Field(() => String)
  durationInfo!: string;

  static init({
    id: uuid,
    title,
    details,
    shownStartingAt,
    durationInfo,
    createdAt,
    updatedAt,
  }: Omit<MarathonHourNode, "getUniqueId">): MarathonHourNode {
    return this.doInit({
      uuid,
      title,
      details,
      shownStartingAt,
      durationInfo,
      createdAt,
      updatedAt,
    });
  }

  public getUniqueId(): string {
    return this.id;
  }
}

export const { MarathonHourConnection, MarathonHourEdge, MarathonHourResult } =
  createNodeClasses(MarathonHourNode, "MarathonHour");
