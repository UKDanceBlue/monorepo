import { Field, ID, ObjectType } from "type-graphql";

import { Node } from "../relay.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType({ implements: [Node] })
export class CommitteeNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;

  public getUniqueId(): string {
    return this.id;
  }
}