import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({ implements: [TimestampedResource, Node] })
export class DeviceResource extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => String, { nullable: true })
  public expoPushToken!: string | null;
  @Field(() => DateTimeISOResolver, { nullable: true })
  public lastLogin!: DateTime | null;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: Partial<DeviceResource>) {
    return DeviceResource.doInit(init);
  }
}

export const { DeviceConnection, DeviceEdge, DeviceResult } = createNodeClasses(
  DeviceResource,
  "Device"
);
