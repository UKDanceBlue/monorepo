import { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import { DateTimeISOScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
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

@ObjectType({
  implements: [Node],
})
export class ConfigurationNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String)
  key!: string;

  @Field(() => String)
  value!: string;

  @Field(() => DateTimeISOScalar, { nullable: true })
  validAfter?: DateTime | undefined | null;

  @Field(() => DateTimeISOScalar, { nullable: true })
  validUntil?: DateTime | undefined | null;

  public getUniqueId(): string {
    return this.key;
  }

  public static init(init: {
    id: string;
    key: string;
    value: string;
    validAfter?: DateTime | undefined | null;
    validUntil?: DateTime | undefined | null;
    createdAt?: DateTime | undefined | null;
    updatedAt?: DateTime | undefined | null;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const {
  ConfigurationConnection,
  ConfigurationEdge,
  ConfigurationResult,
} = createNodeClasses(ConfigurationNode, "Configuration");
