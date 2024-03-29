import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../scalars/DateTimeScalar.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class DeviceResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String, { nullable: true })
  public expoPushToken!: string | null;
  @Field(() => DateTimeScalar, { nullable: true })
  public lastLogin!: DateTime | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<DeviceResource>) {
    return DeviceResource.doInit(init);
  }
}
