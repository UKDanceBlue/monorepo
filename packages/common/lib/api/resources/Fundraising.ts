import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Maybe } from "true-myth";
import { nothing, of } from "true-myth/maybe";
import { Field, Float, ID, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class FundraisingEntryNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => String, { nullable: true, name: "donatedByText" })
  private _donatedByText!: string | null;
  get donatedByText(): Maybe<string> {
    return of(this._donatedByText);
  }
  set donatedByText(value: Maybe<string>) {
    this._donatedByText = value.unwrapOr(null);
  }
  @Field(() => String, { nullable: true, name: "donatedToText" })
  private _donatedToText!: string | null;
  get donatedToText(): Maybe<string> {
    return of(this._donatedToText);
  }
  set donatedToText(value: Maybe<string>) {
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
    return this.id;
  }

  public static init(init: {
    id: string;
    donatedByText: Maybe<string> | string | null;
    donatedToText: Maybe<string> | string | null;
    donatedOn: Date;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    const node = new FundraisingEntryNode();
    node.id = init.id;
    node.donatedByText =
      init.donatedByText == null
        ? nothing()
        : typeof init.donatedByText === "string"
          ? of(init.donatedByText)
          : init.donatedByText;
    node.donatedToText =
      init.donatedToText == null
        ? nothing()
        : typeof init.donatedToText === "string"
          ? of(init.donatedToText)
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
  @Field(() => ID)
  id!: string;
  @Field(() => Float)
  amount!: number;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: {
    id: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return FundraisingAssignmentNode.doInit(init);
  }
}

export const {
  FundraisingAssignmentConnection,
  FundraisingAssignmentEdge,
  FundraisingAssignmentResult,
} = createNodeClasses(FundraisingAssignmentNode, "FundraisingAssignment");
