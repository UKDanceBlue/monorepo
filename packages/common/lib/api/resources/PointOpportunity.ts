import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../scalars/DateTimeScalar.js";

import { TimestampedResource } from "./Resource.js";
import { TeamType } from "./Team.js";

@ObjectType()
export class PointOpportunityResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => DateTimeScalar, { nullable: true })
  opportunityDate!: DateTime | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<PointOpportunityResource>) {
    return PointOpportunityResource.doInit(init);
  }
}
