import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { Node } from "../relay.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class MarathonHourNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  details?: string | undefined | null;
  @Field(() => DateTimeScalar)
  shownStartingAt!: DateTime;
  @Field(() => String)
  durationInfo!: string;

  @Field(() => String)
  text(): string {
    return this.title;
  }

  static init({
    id,
    title,
    details,
    shownStartingAt,
    durationInfo,
    createdAt,
    updatedAt,
  }: {
    id: string;
    title: string;
    details?: string | undefined | null;
    shownStartingAt: DateTime;
    durationInfo: string;
    createdAt?: DateTime | undefined | null;
    updatedAt?: DateTime | undefined | null;
  }): MarathonHourNode {
    return this.createInstance().withValues({
      id,
      title,
      details,
      shownStartingAt,
      durationInfo,
      createdAt,
      updatedAt,
    });
  }

  public getUniqueId(): string {
    return this.id.id;
  }
}
