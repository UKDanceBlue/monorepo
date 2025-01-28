import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({ implements: [Node] })
export class DeviceNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => DateTimeScalar, { nullable: true })
  public lastLogin?: DateTime | undefined | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  @Field(() => String)
  public text(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    lastLogin?: DateTime | undefined | null;
    createdAt: DateTime;
    updatedAt: DateTime;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const { DeviceConnection, DeviceEdge, DeviceResult } = createNodeClasses(
  DeviceNode,
  "Device"
);
