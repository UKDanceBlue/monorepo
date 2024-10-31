import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { createNodeClasses,Node } from "../relay.js";
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
  startDate?: Date | undefined | null;
  get startDateDateTime(): DateTime | null {
    return dateTimeFromSomething(this.startDate) ?? null;
  }
  @Field(() => DateTimeISOResolver, { nullable: true })
  endDate?: Date | undefined | null;
  get endDateDateTime(): DateTime | null {
    return dateTimeFromSomething(this.endDate) ?? null;
  }

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
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
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
