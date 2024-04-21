import { DateTimeISOResolver } from "graphql-scalars";
import { Field, ID, ObjectType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({ implements: [TimestampedResource, Node] })
export class DeviceResource extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => DateTimeISOResolver, { nullable: true })
  public lastLogin!: Date | null;

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
