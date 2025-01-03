import { IsDivisibleBy } from "class-validator";
import { GraphQLLocalDate, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, Float, InputType, ObjectType } from "type-graphql";

import type { LocalDate } from "../../utility/time/localDate.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { BatchType } from "../resources/DailyDepartmentNotification.js";
import { FundraisingEntryNode } from "../resources/Fundraising.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ArgsType()
export class ListFundraisingEntriesArgs extends FilteredListQueryArgs(
  "FundraisingEntryResolver",
  [
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
  ]
) {}

@ObjectType("ListFundraisingEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<FundraisingEntryNode[]>,
})
export class ListFundraisingEntriesResponse extends AbstractGraphQLPaginatedResponse<FundraisingEntryNode> {
  @Field(() => [FundraisingEntryNode])
  data!: FundraisingEntryNode[];
}

@InputType("SetFundraisingEntryInput")
export class SetFundraisingEntryInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  notes?: string;

  @Field(() => GlobalIdScalar, { nullable: true })
  solicitationCodeOverrideId?: GlobalId;

  @IsDivisibleBy(0.01)
  @Field(() => Float, { nullable: true })
  amountOverride?: number;

  @Field(() => GraphQLLocalDate, { nullable: true })
  donatedOnOverride?: LocalDate;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedToOverride?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedByOverride?: string;

  @Field(() => BatchType, { nullable: true })
  batchTypeOverride?: BatchType;
}
