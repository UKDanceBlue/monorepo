import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, Float, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node } from "../relay.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class FundraisingEntryNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => String)
  donatedByText!: string;
  @Field(() => String)
  donatedToText!: string;
  @Field(() => DateTimeISOResolver)
  start!: Date;
  get startDateTime(): DateTime {
    return dateTimeFromSomething(this.start);
  }
  @Field(() => Float)
  amount!: number;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: Partial<FundraisingEntryNode>) {
    return FundraisingEntryNode.doInit(init);
  }
}

@ObjectType({
  implements: [Node],
})
export class FundraisingAssignmentNode
  extends TimestampedResource
  implements Node
{
  @Field(() => ID)
  id!: string;
  @Field(() => Float)
  amount!: number;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: Partial<FundraisingAssignmentNode>) {
    return FundraisingAssignmentNode.doInit(init);
  }
}
