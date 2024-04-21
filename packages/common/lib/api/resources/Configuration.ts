import { DateTimeISOResolver } from "graphql-scalars";
import { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";

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
export class ConfigurationNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  key!: string;

  @Field(() => String)
  value!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  validAfter?: Date | null;
  get validAfterDateTime(): DateTime | null {
    return dateTimeFromSomething(this.validAfter ?? null);
  }

  @Field(() => DateTimeISOResolver, { nullable: true })
  validUntil?: Date | null;
  get validUntilDateTime(): DateTime | null {
    return dateTimeFromSomething(this.validUntil ?? null);
  }

  public getUniqueId(): string {
    return this.key;
  }

  public static init(init: Partial<ConfigurationNode>) {
    return ConfigurationNode.doInit(init);
  }
}

export const {
  ConfigurationConnection,
  ConfigurationEdge,
  ConfigurationResult,
} = createNodeClasses(ConfigurationNode, "Configuration");
