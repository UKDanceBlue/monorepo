import { GraphQLLocalDate, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, Float, InputType, ObjectType } from "type-graphql";

import type { LocalDate } from "../../utility/time/localDate.js";
import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { BatchType } from "../resources/DailyDepartmentNotification.js";
import { FundraisingEntryNode } from "../resources/Fundraising.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ArgsType()
export class ListFundraisingEntriesArgs extends FilteredListQueryArgs(
  "FundraisingEntryResolver",
  [
    "donatedOn",
    "amount",
    "amountUnassigned",
    "donatedTo",
    "donatedBy",
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

@InputType("CreateFundraisingEntryInput")
export class CreateFundraisingEntryInput {
  @Field(() => GlobalIdScalar)
  solicitationCodeId!: GlobalId;

  @Field(() => Float)
  amount!: number;

  @Field(() => GraphQLLocalDate, { nullable: true })
  donatedOn?: LocalDate;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedTo?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedBy?: string;

  @Field(() => BatchType)
  batchType!: BatchType;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  notes?: string;
}
