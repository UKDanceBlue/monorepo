import { ArgsType, Field, Float, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { BatchType } from "../resources/DailyDepartmentNotification.js";
import { FundraisingEntryNode } from "../resources/Fundraising.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ArgsType()
export class ListFundraisingEntriesArgs extends FilteredListQueryArgs<
  | "donatedOn"
  | "amount"
  | "amountUnassigned"
  | "donatedTo"
  | "donatedBy"
  | "teamId"
  | "batchType"
  | "createdAt"
  | "updatedAt"
  | "solicitationCode",
  "donatedTo" | "donatedBy" | "solicitationCode",
  "teamId" | "batchType",
  "amount" | "amountUnassigned",
  "donatedOn" | "createdAt" | "updatedAt",
  never
>("FundraisingEntryResolver", {
  all: [
    "donatedOn",
    "amount",
    "amountUnassigned",
    "donatedTo",
    "donatedBy",
    "teamId",
    "batchType",
    "createdAt",
    "updatedAt",
    "solicitationCode",
  ],
  string: ["donatedTo", "donatedBy", "solicitationCode"],
  numeric: ["amount", "amountUnassigned"],
  oneOf: ["teamId", "batchType"],
  date: ["donatedOn", "createdAt", "updatedAt"],
}) {}

@ObjectType("ListFundraisingEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<FundraisingEntryNode[]>,
})
export class ListFundraisingEntriesResponse extends AbstractGraphQLPaginatedResponse<FundraisingEntryNode> {
  @Field(() => [FundraisingEntryNode])
  data!: FundraisingEntryNode[];
}

@InputType("SetFundraisingEntryInput")
export class SetFundraisingEntryInput {
  @Field({ nullable: true })
  notes?: string;

  @Field(() => GlobalIdScalar, { nullable: true })
  solicitationCodeOverrideId?: GlobalId;

  @Field(() => Float, { nullable: true })
  amountOverride?: number;

  @Field({ nullable: true })
  donatedOnOverride?: string;

  @Field({ nullable: true })
  donatedToOverride?: string;

  @Field({ nullable: true })
  donatedByOverride?: string;

  @Field(() => BatchType, { nullable: true })
  batchTypeOverride?: BatchType;
}
