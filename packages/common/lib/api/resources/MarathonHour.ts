import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType()
export class MarathonHourResource extends TimestampedResource implements Node {
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
    id,
    title,
    details,
    shownStartingAt,
    durationInfo,
    createdAt,
    updatedAt,
  }: Omit<MarathonHourResource, "getUniqueId">): MarathonHourResource {
    return this.doInit({
      id,
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
  createNodeClasses(MarathonHourResource, "MarathonHour");
