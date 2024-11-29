import { NonEmptyStringResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { DbRole } from "../../authorization/structures.js";
import { OptionalToNullable } from "../../utility/primitive/TypeUtils.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { TeamLegacyStatus, TeamNode, TeamType } from "../resources/Team.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
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
  @Field(() => NonEmptyStringResolver)
  name!: string;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;
}

@InputType()
export class SetTeamInput implements OptionalToNullable<Partial<TeamNode>> {
  @Field(() => NonEmptyStringResolver, { nullable: true })
  name!: string | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => TeamLegacyStatus, { nullable: true })
  legacyStatus!: TeamLegacyStatus | null;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  persistentIdentifier!: string | null;
}

@InputType()
export class BulkTeamInput {
  @Field(() => NonEmptyStringResolver)
  name!: string;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;

  @Field(() => [NonEmptyStringResolver], { nullable: true })
  captainLinkblues!: string[] | null;

  @Field(() => [NonEmptyStringResolver], { nullable: true })
  memberLinkblues!: string[] | null;
}

@ArgsType()
export class ListTeamsArgs extends FilteredListQueryArgs<
  "name" | "type" | "legacyStatus" | "marathonId",
  "name",
  "type" | "legacyStatus" | "marathonId",
  never,
  never,
  never
>("TeamResolver", {
  all: ["name", "type", "legacyStatus", "marathonId"],
  string: ["name"],
  numeric: [],
  oneOf: ["type", "marathonId", "legacyStatus"],
}) {
  @Field(() => [TeamType], { nullable: true })
  type!: [TeamType] | null;

  @Field(() => [TeamLegacyStatus], { nullable: true })
  legacyStatus!: [TeamLegacyStatus] | null;

  @Field(() => [DbRole], { nullable: true, deprecationReason: "Use type" })
  visibility!: [DbRole] | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  marathonId!: GlobalId[] | null;
}

@ObjectType("DbFundsTeamInfo")
export class DbFundsTeamInfo {
  @Field(() => Int)
  dbNum!: number;

  @Field(() => String)
  name!: string;
}
