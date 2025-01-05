import { IsAlpha, IsUppercase } from "class-validator";
import { GraphQLNonEmptyString, NonNegativeIntResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { SolicitationCodeNode } from "../resources/SolicitationCode.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ArgsType()
export class ListSolicitationCodesArgs extends FilteredListQueryArgs(
  "SolicitationCode",
  ["name", "prefix", "code", "createdAt", "updatedAt"]
) {}

@ObjectType("ListSolicitationCodesResponse", {
  implements: AbstractGraphQLPaginatedResponse<SolicitationCodeNode[]>,
})
export class ListSolicitationCodesResponse extends AbstractGraphQLPaginatedResponse<SolicitationCodeNode> {
  @Field(() => [SolicitationCodeNode])
  data!: SolicitationCodeNode[];
}

@InputType("SetSolicitationCodeInput")
export class SetSolicitationCodeInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name?: string | null | undefined;
}

@InputType("CreateSolicitationCodeInput")
export class CreateSolicitationCodeInput extends SetSolicitationCodeInput {
  @IsAlpha()
  @IsUppercase()
  @Field(() => GraphQLNonEmptyString)
  prefix!: string;

  @Field(() => NonNegativeIntResolver)
  code!: number;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name?: string | null | undefined;
}
