import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class MarathonNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => String)
  year!: string;
  @Field(() => DateTimeISOResolver, { nullable: true })
  startDate?: DateTime | undefined | null;
  @Field(() => DateTimeISOResolver, { nullable: true })
  endDate?: DateTime | undefined | null;

  static init({
    id: id,
    year,
    startDate,
    endDate,
    createdAt,
    updatedAt,
  }: {
    id: string;
    year: string;
    startDate?: DateTime | undefined | null;
    endDate?: DateTime | undefined | null;
    createdAt?: DateTime | undefined | null;
    updatedAt?: DateTime | undefined | null;
  }): MarathonNode {
    return this.createInstance().withValues({
      id,
      year,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    });
  }

  public getUniqueId(): string {
    return this.id.id;
  }
}

export const { MarathonConnection, MarathonEdge, MarathonResult } =
  createNodeClasses(MarathonNode, "Marathon");
