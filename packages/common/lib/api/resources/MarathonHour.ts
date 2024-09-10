import { TimestampedResource } from "./Resource.js";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { DateTimeISOResolver } from "graphql-scalars";
import { Field, ObjectType } from "type-graphql";

import type { GlobalId } from "../scalars/GlobalId.js";
import type { DateTime } from "luxon";

@ObjectType({
  implements: [Node],
})
export class MarathonHourNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
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
  }: {
    id: string;
    title: string;
    details?: string | null;
    shownStartingAt: Date;
    durationInfo: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }): MarathonHourNode {
    return this.createInstance().withValues({
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
    return this.id.id;
  }
}

export const { MarathonHourConnection, MarathonHourEdge, MarathonHourResult } =
  createNodeClasses(MarathonHourNode, "MarathonHour");
