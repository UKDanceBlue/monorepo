import { DateTime } from "luxon";
import { Field, Float, ObjectType, registerEnumType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { BatchType } from "./DailyDepartmentNotification.js";
import { TimestampedResource } from "./Resource.js";
import { SolicitationCodeNode } from "./SolicitationCode.js";

export const FundraisingEntrySource = {
  DBFunds: "DBFunds",
  DDN: "DDN",
  Override: "Override",
} as const;
export type FundraisingEntrySource =
  (typeof FundraisingEntrySource)[keyof typeof FundraisingEntrySource];

registerEnumType(FundraisingEntrySource, {
  name: "FundraisingEntrySource",
});

@ObjectType({
  implements: [Node],
})
export class FundraisingEntryNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String, { nullable: true, name: "donatedByText" })
  donatedByText!: string | null | undefined;

  @Field(() => String, { nullable: true, name: "donatedByOverride" })
  donatedByOverride!: string | null | undefined;

  @Field(() => String, { nullable: true, name: "donatedToText" })
  donatedToText!: string | null | undefined;

  @Field(() => String, { nullable: true, name: "donatedToOverride" })
  donatedToOverride!: string | null | undefined;

  @Field(() => DateTimeScalar, { nullable: true, name: "donatedOn" })
  donatedOn!: DateTime | null | undefined;

  @Field(() => DateTimeScalar, {
    nullable: true,
    name: "donatedOnOverride",
  })
  donatedOnOverride!: DateTime | null | undefined;

  @Field(() => Float)
  amount!: number;

  @Field(() => Float, { nullable: true })
  amountOverride!: number | null | undefined;

  @Field(() => Float)
  amountUnassigned!: number;

  @Field(() => String, { nullable: true })
  notes?: string | null | undefined;

  @Field(() => SolicitationCodeNode, { nullable: true })
  solicitationCodeOverride?: SolicitationCodeNode | null | undefined;

  @Field(() => BatchType)
  batchType!: BatchType;

  @Field(() => BatchType, { nullable: true })
  batchTypeOverride!: BatchType | null | undefined;

  @Field(() => FundraisingEntrySource)
  source!: FundraisingEntrySource;

  @Field(() => String)
  text(): string {
    return `Donation of $${this.amount} via ${this.source} from ${
      this.donatedByText || "Unknown"
    } to ${this.donatedToText || "Unknown"} on ${
      this.donatedOn?.toLocaleString(DateTime.DATE_SHORT) || "Unknown"
    }`;
  }

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    donatedByText: string | null;
    donatedByOverride: string | null;
    donatedToText: string | null;
    donatedToOverride: string | null;
    donatedOn: DateTime | null;
    donatedOnOverride: DateTime | null;
    amount: number;
    amountOverride: number | null;
    amountUnassigned: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    notes?: string | null;
    solicitationCodeOverride?: SolicitationCodeNode | null;
    batchType: BatchType;
    batchTypeOverride: BatchType | null;
    source: FundraisingEntrySource;
  }) {
    return FundraisingEntryNode.createInstance().withValues(init);
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

  @Field(() => String)
  text(): string {
    return `Assignment of $${this.amount}`;
  }

  public static init(init: {
    id: string;
    amount: number;
    createdAt: DateTime;
    updatedAt: DateTime;
  }) {
    return FundraisingAssignmentNode.createInstance().withValues(init);
  }
}

export const {
  FundraisingAssignmentConnection,
  FundraisingAssignmentEdge,
  FundraisingAssignmentResult,
} = createNodeClasses(FundraisingAssignmentNode, "FundraisingAssignment");
