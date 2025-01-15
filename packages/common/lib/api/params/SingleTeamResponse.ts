import { GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { OptionalToNullable } from "../../utility/primitive/TypeUtils.js";
import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { TeamLegacyStatus, TeamNode, TeamType } from "../resources/Team.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";
@ObjectType("ListTeamsResponse", {
  implements: AbstractGraphQLPaginatedResponse<TeamNode>,
})
export class ListTeamsResponse extends AbstractGraphQLPaginatedResponse<TeamNode> {
  @Field(() => [TeamNode])
  data!: TeamNode[];
}

@InputType()
export class CreateTeamInput implements OptionalToNullable<Partial<TeamNode>> {
  @Field(() => GraphQLNonEmptyString)
  name!: string;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;
}

@InputType()
export class SetTeamInput implements OptionalToNullable<Partial<TeamNode>> {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name!: string | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => TeamLegacyStatus, { nullable: true })
  legacyStatus!: TeamLegacyStatus | null;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  persistentIdentifier!: string | null;
}

@InputType()
export class BulkTeamInput {
  @Field(() => GraphQLNonEmptyString)
  name!: string;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;

  @Field(() => [GraphQLNonEmptyString], { nullable: true })
  captainLinkblues!: string[] | null;

  @Field(() => [GraphQLNonEmptyString], { nullable: true })
  memberLinkblues!: string[] | null;
}

@ArgsType()
export class ListTeamsArgs extends FilteredListQueryArgs("TeamResolver", [
  "name",
  "type",
  "legacyStatus",
  "marathonYear",
  "totalPoints",
]) {}

@ObjectType("DbFundsTeamInfo")
export class DbFundsTeamInfo {
  @Field(() => Int)
  dbNum!: number;

  @Field(() => String)
  name!: string;
}
