import { DateTimeISOResolver } from "graphql-scalars";
import { Field, ID, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class MarathonResource extends TimestampedResource {
  @Field(() => ID)
  id!: string;
  @Field(() => String)
  year!: string;
  @Field(() => DateTimeISOResolver)
  startDate!: string;
  @Field(() => DateTimeISOResolver)
  endDate!: string;

  static init({
    uuid,
    year,
    startDate,
    endDate,
    createdAt,
    updatedAt,
  }: Omit<MarathonResource, "getUniqueId">): MarathonResource {
    return this.doInit({
      uuid,
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
