import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../custom-scalars/DateTimeScalar.js";

import { PersonResource } from "./Person.js";
import { Resource } from "./Resource.js";

@ObjectType()
export class DeviceResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String, { nullable: true })
  public expoPushToken!: string | null;
  @Field(() => PersonResource, { nullable: true })
  public lastUser!: PersonResource | null;
  @Field(() => DateTimeScalar, { nullable: true })
  public lastLogin!: DateTime | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<DeviceResource>) {
    return DeviceResource.doInit(init);
  }
}
