import { DateTime } from "luxon";
import { Field, Int, ObjectType } from "type-graphql";

import { Node } from "../relay.js";
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

  @Field(() => String)
  text(): string {
    return `${this.points} points${this.comment ? `: ${this.comment}` : ""}`;
  }

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    comment?: string | undefined | null;
    points: number;
    createdAt?: DateTime | undefined | null;
    updatedAt?: DateTime | undefined | null;
  }) {
    return this.createInstance().withValues(init);
  }
}
