import { Field, Int, ObjectType } from "type-graphql";

import { createNodeClasses,Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

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
