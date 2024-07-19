import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({ implements: [Node] })
export class DeviceNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => DateTimeISOResolver, { nullable: true })
  public lastLogin?: Date | null;
  get lastLoginDateTime(): DateTime | null {
    return dateTimeFromSomething(this.lastLogin ?? null);
  }

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    lastLogin?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const { DeviceConnection, DeviceEdge, DeviceResult } = createNodeClasses(
  DeviceNode,
  "Device"
);
