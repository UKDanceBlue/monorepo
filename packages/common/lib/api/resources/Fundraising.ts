import { TimestampedResource } from "./Resource.js";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { DateTimeISOResolver } from "graphql-scalars";
import { None, Option, Some } from "ts-results-es";
import { Field, Float, ObjectType } from "type-graphql";


import type { GlobalId } from "../scalars/GlobalId.js";
import type { DateTime } from "luxon";



@ObjectType({
  implements: [Node],
})
export class FundraisingEntryNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => String, { nullable: true, name: "donatedByText" })
  private _donatedByText!: string | null;
  get donatedByText(): Option<string> {
    return this._donatedByText ? Some(this._donatedByText) : None;
  }
  set donatedByText(value: Option<string>) {
    this._donatedByText = value.unwrapOr(null);
  }
  @Field(() => String, { nullable: true, name: "donatedToText" })
  private _donatedToText!: string | null;
  get donatedToText(): Option<string> {
    return this._donatedToText ? Some(this._donatedToText) : None;
  }
  set donatedToText(value: Option<string>) {
    this._donatedToText = value.unwrapOr(null);
  }
  @Field(() => DateTimeISOResolver)
  donatedOn!: Date;
  get donatedOnDateTime(): DateTime {
    return dateTimeFromSomething(this.donatedOn);
  }
  @Field(() => Float)
  amount!: number;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    donatedByText: Option<string> | string | null;
    donatedToText: Option<string> | string | null;
    donatedOn: Date;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const node = new FundraisingEntryNode();
    node.id = {
      id: init.id,
      typename: "FundraisingEntryNode",
    };
    node.donatedByText =
      init.donatedByText == null
        ? None
        : typeof init.donatedByText === "string"
          ? Some(init.donatedByText)
          : init.donatedByText;
    node.donatedToText =
      init.donatedToText == null
        ? None
        : typeof init.donatedToText === "string"
          ? Some(init.donatedToText)
          : init.donatedToText;
    node.donatedOn = init.donatedOn;
    node.amount = init.amount;
    node.createdAt = init.createdAt;
    node.updatedAt = init.updatedAt;

    return node;
  }
}

export const {
  FundraisingEntryConnection,
  FundraisingEntryEdge,
  FundraisingEntryResult,
} = createNodeClasses(FundraisingEntryNode, "FundraisingEntry");

@ObjectType({
  implements: [Node],
})
export class FundraisingAssignmentNode
  extends TimestampedResource
  implements Node
{
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => Float)
  amount!: number;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return FundraisingAssignmentNode.createInstance().withValues(init);
  }
}

export const {
  FundraisingAssignmentConnection,
  FundraisingAssignmentEdge,
  FundraisingAssignmentResult,
} = createNodeClasses(FundraisingAssignmentNode, "FundraisingAssignment");
