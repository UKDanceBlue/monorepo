import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({ implements: [TimestampedResource, Node] })
export class DeviceResource extends TimestampedResource implements Node {
  @Field(() => ID)
  uuid!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  public lastLogin?: Date | null;
  get lastLoginDateTime(): DateTime | null {
    return dateTimeFromSomething(this.lastLogin ?? null);
  }

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<DeviceResource>) {
    return DeviceResource.doInit(init);
  }
}

export const { DeviceConnection, DeviceEdge, DeviceResult } = createNodeClasses(
  DeviceResource,
  "Device"
);
