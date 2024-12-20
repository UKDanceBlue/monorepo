import { GraphQLDateTimeISO } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";
import { TeamType } from "./Team.js";

@ObjectType({
  implements: [Node],
})
export class PointOpportunityNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => String)
  name!: string;
  @Field(() => TeamType)
  type!: TeamType;
  @Field(() => GraphQLDateTimeISO, { nullable: true })
  opportunityDate!: Date | null;
  get opportunityDateTime(): DateTime | null {
    return dateTimeFromSomething(this.opportunityDate ?? null);
  }

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    name: string;
    type: TeamType;
    opportunityDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return this.createInstance().withValues(init);
  }
}
