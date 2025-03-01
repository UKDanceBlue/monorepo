import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import type { MarathonYearString } from "../../utility/primitive/SimpleTypes.js";
import { Node } from "../relay.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { MarathonYearScalar } from "../scalars/MarathonYear.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class MarathonNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar, { nullable: false })
  id!: GlobalId;
  @Field(() => MarathonYearScalar, { nullable: false })
  year!: MarathonYearString;
  @Field(() => DateTimeScalar, { nullable: true })
  startDate?: DateTime | undefined | null;
  @Field(() => DateTimeScalar, { nullable: true })
  endDate?: DateTime | undefined | null;

  @Field(() => String, { nullable: false })
  text(): string {
    return this.year;
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
