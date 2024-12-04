import {
  NonEmptyStringResolver,
  NonNegativeIntResolver,
} from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { SolicitationCodeNode } from "../resources/SolicitationCode.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ArgsType()
export class ListSolicitationCodesArgs extends FilteredListQueryArgs<
  "name" | "prefix" | "code" | "createdAt" | "updatedAt",
  "name" | "prefix",
  never,
  "code",
  "createdAt" | "updatedAt",
  never
>("FundraisingEntryResolver", {
  all: ["name", "prefix", "code", "createdAt", "updatedAt"],
  string: ["name", "prefix"],
  numeric: ["code"],
  date: ["createdAt", "updatedAt"],
}) {}

@ObjectType("ListSolicitationCodesResponse", {
  implements: AbstractGraphQLPaginatedResponse<SolicitationCodeNode[]>,
})
export class ListSolicitationCodesResponse extends AbstractGraphQLPaginatedResponse<SolicitationCodeNode> {
  @Field(() => [SolicitationCodeNode])
  data!: SolicitationCodeNode[];
}

@InputType("SetSolicitationCodeInput")
export class SetSolicitationCodeInput {
  @Field(() => NonEmptyStringResolver, { nullable: true })
  name?: string | null | undefined;
}

@InputType("CreateSolicitationCodeInput")
export class CreateSolicitationCodeInput extends SetSolicitationCodeInput {
  @Field(() => NonEmptyStringResolver)
  prefix!: string;

  @Field(() => NonNegativeIntResolver)
  code!: number;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  name?: string | null | undefined;
}
