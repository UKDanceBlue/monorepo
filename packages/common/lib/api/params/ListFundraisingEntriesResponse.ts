import { ArgsType, ObjectType, Field } from "type-graphql";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { FundraisingEntryNode } from "../resources/Fundraising.js";

@ArgsType()
export class ListFundraisingEntriesArgs extends FilteredListQueryArgs<
  | "donatedOn"
  | "amount"
  | "amountUnassigned"
  | "donatedTo"
  | "donatedBy"
  | "teamId"
  | "createdAt"
  | "updatedAt",
  "donatedTo" | "donatedBy",
  "teamId",
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
    "createdAt",
    "updatedAt",
  ],
  string: ["donatedTo", "donatedBy"],
  numeric: ["amount", "amountUnassigned"],
  oneOf: ["teamId"],
  date: ["donatedOn", "createdAt", "updatedAt"],
}) {}

@ObjectType("ListFundraisingEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<FundraisingEntryNode[]>,
})
export class ListFundraisingEntriesResponse extends AbstractGraphQLPaginatedResponse<FundraisingEntryNode> {
  @Field(() => [FundraisingEntryNode])
  data!: FundraisingEntryNode[];
}
