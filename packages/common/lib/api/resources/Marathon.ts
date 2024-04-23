import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({
  implements: [TimestampedResource, Node],
})
export class MarathonNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
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
    id: id,
    year,
    startDate,
    endDate,
    createdAt,
    updatedAt,
  }: {
    id: string;
    year: string;
    startDate: Date;
    endDate: Date;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }): MarathonNode {
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
    return this.id;
  }
}

export const { MarathonConnection, MarathonEdge, MarathonResult } =
  createNodeClasses(MarathonNode, "Marathon");
