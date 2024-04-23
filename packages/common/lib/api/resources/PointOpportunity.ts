import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
import { TeamType } from "./Team.js";

@ObjectType({
  implements: [Node],
})
export class PointOpportunityResource
  extends TimestampedResource
  implements Node
{
  @Field(() => ID)
  id!: string;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => DateTimeISOResolver, { nullable: true })
  opportunityDate!: Date | null;
  get opportunityDateTime(): DateTime | null {
    return dateTimeFromSomething(this.opportunityDate ?? null);
  }

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: Partial<PointOpportunityResource>) {
    return PointOpportunityResource.doInit(init);
  }
}
