import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { Node } from "../relay.js";
import { DateTimeISOScalar } from "../scalars/DateTimeISO.js";
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
  @Field(() => DateTimeISOScalar, { nullable: true })
  opportunityDate!: DateTime | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    name: string;
    type: TeamType;
    opportunityDate: DateTime | null;
    createdAt: DateTime;
    updatedAt: DateTime;
  }) {
    return this.createInstance().withValues(init);
  }
}
