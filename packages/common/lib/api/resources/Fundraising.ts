import { DateTimeISOResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, Float, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { createNodeClasses, Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { BatchType } from "./DailyDepartmentNotification.js";
import { TimestampedResource } from "./Resource.js";
import { SolicitationCodeNode } from "./SolicitationCode.js";

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

  @Field(() => DateTimeISOResolver, { nullable: true, name: "donatedOn" })
  donatedOn!: Date | null | undefined;
  get donatedOnDateTime(): DateTime | null | undefined {
    return dateTimeFromSomething(this.donatedOn);
  }

  @Field(() => DateTimeISOResolver, {
    nullable: true,
    name: "donatedOnOverride",
  })
  donatedOnOverride!: Date | null | undefined;
  get donatedOnOverrideDateTime(): DateTime | null | undefined {
    return dateTimeFromSomething(this.donatedOnOverride);
  }

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

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    donatedByText: string | null;
    donatedByOverride: string | null;
    donatedToText: string | null;
    donatedToOverride: string | null;
    donatedOn: Date | null;
    donatedOnOverride: Date | null;
    amount: number;
    amountOverride: number | null;
    amountUnassigned: number;
    createdAt: Date;
    updatedAt: Date;
    notes?: string | null;
    solicitationCodeOverride?: SolicitationCodeNode | null;
    batchType: BatchType;
    batchTypeOverride: BatchType | null;
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
