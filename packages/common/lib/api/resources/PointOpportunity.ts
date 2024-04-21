import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";
import { TeamType } from "./Team.js";

@ObjectType()
export class PointOpportunityResource extends TimestampedResource {
  @Field(() => ID)
  id!: string;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => DateTimeISOResolver, { nullable: true })
  opportunityDate!: DateTime | null;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: Partial<PointOpportunityResource>) {
    return PointOpportunityResource.doInit(init);
  }
}
