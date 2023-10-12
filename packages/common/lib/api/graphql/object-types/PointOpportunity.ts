import { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { Resource } from "./Resource.js";
import { TeamType } from "./Team.js";

@ObjectType()
export class PointOpportunityResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => String)
  name!: string;
  @Field(() => DateTime, { nullable: true })
  opportunityDate!: DateTime | null;
  @Field(() => String)
  teamUuid!: string;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<PointOpportunityResource>) {
    return PointOpportunityResource.doInit(init);
  }
}
