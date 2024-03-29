import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../scalars/DateTimeScalar.js";

import { TimestampedResource } from "./Resource.js";

/*
The way configurations work is that there can be n number of configurations,
each with it's own UUID. When multiple configurations are created with the
same key, the most recent *VALID* configuration is used. This allows us to
create configurations in advance and have them automatically take effect
when the time comes.

This also means we have some of the logic we need for a configuration
to have additional validation logic in the future.
*/

@ObjectType()
export class ConfigurationResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;

  @Field(() => String)
  key!: string;

  @Field(() => String)
  value!: string;

  @Field(() => DateTimeScalar, { nullable: true })
  validAfter!: DateTime | null;

  @Field(() => DateTimeScalar, { nullable: true })
  validUntil!: DateTime | null;

  public getUniqueId(): string {
    return this.key;
  }

  public static init(init: Partial<ConfigurationResource>) {
    return ConfigurationResource.doInit(init);
  }
}
