import { IsAlpha, IsUppercase } from "class-validator";
import { GraphQLNonEmptyString, NonNegativeIntResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import {
  SolicitationCodeNode,
  SolicitationCodeTag,
} from "../resources/SolicitationCode.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ArgsType()
export class ListSolicitationCodesArgs extends FilteredListQueryArgs(
  "SolicitationCodeResolver",
  ["name", "prefix", "code", "tags", "text", "createdAt", "updatedAt"]
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

  @Field(() => [SolicitationCodeTag])
  tags!: SolicitationCodeTag[];

  @Field(() => [GlobalIdScalar])
  teamIds!: GlobalId[];
}

@InputType("CreateSolicitationCodeInput")
export class CreateSolicitationCodeInput {
  @IsAlpha()
  @IsUppercase()
  @Field(() => GraphQLNonEmptyString)
  prefix!: string;

  @Field(() => NonNegativeIntResolver)
  code!: number;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name?: string | null | undefined;

  @Field(() => [SolicitationCodeTag])
  tags!: SolicitationCodeTag[];
}
