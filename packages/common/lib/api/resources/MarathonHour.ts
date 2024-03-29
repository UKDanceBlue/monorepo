import { DateTimeISOResolver } from "graphql-scalars";
import { Field, ID, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class MarathonHourResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  details?: string | null;
  @Field(() => DateTimeISOResolver)
  shownStartingAt!: string;
  @Field(() => String)
  durationInfo!: string;

  static init({
    uuid,
    title,
    details,
    shownStartingAt,
    durationInfo,
    createdAt,
    updatedAt,
  }: Omit<MarathonHourResource, "getUniqueId">): MarathonHourResource {
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
    return this.uuid;
  }
}
