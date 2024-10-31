import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { createNodeClasses,Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

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
