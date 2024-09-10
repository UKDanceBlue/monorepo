import { TimestampedResource } from "./Resource.js";

import { Node, createNodeClasses } from "../relay.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { Field, Int, ObjectType } from "type-graphql";

import type { GlobalId } from "../scalars/GlobalId.js";

@ObjectType({
  implements: [Node],
})
export class PointEntryNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => String, { nullable: true })
  comment!: string | null;
  @Field(() => Int)
  points!: number;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    comment?: string | null;
    points: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const { PointEntryConnection, PointEntryEdge, PointEntryResult } =
  createNodeClasses(PointEntryNode, "PointEntry");
