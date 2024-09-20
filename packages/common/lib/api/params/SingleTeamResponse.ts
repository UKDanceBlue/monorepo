import {
  TeamNode,
  type OptionalToNullable,
  TeamType,
  TeamLegacyStatus,
  FilteredListQueryArgs,
  DbRole,
  GlobalIdScalar,
  type GlobalId,
} from "@ukdanceblue/common";
import { ObjectType, Field, InputType, ArgsType, Int } from "type-graphql";
import {
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  AbstractGraphQLCreatedResponse,
} from "./ApiResponse.js";

@ObjectType("SingleTeamResponse", {
  implements: AbstractGraphQLOkResponse<TeamNode>,
})
export class SingleTeamResponse extends AbstractGraphQLOkResponse<TeamNode> {
  @Field(() => TeamNode)
  data!: TeamNode;
}
@ObjectType("ListTeamsResponse", {
  implements: AbstractGraphQLPaginatedResponse<TeamNode>,
})
export class ListTeamsResponse extends AbstractGraphQLPaginatedResponse<TeamNode> {
  @Field(() => [TeamNode])
  data!: TeamNode[];
}
@ObjectType("CreateTeamResponse", {
  implements: AbstractGraphQLCreatedResponse<TeamNode>,
})
export class CreateTeamResponse extends AbstractGraphQLCreatedResponse<TeamNode> {
  @Field(() => TeamNode)
  data!: TeamNode;
}
@ObjectType("DeleteTeamResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class DeleteTeamResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
export class CreateTeamInput implements OptionalToNullable<Partial<TeamNode>> {
  @Field(() => String)
  name!: string;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;
}

@InputType()
export class SetTeamInput implements OptionalToNullable<Partial<TeamNode>> {
  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => TeamLegacyStatus, { nullable: true })
  legacyStatus!: TeamLegacyStatus | null;

  @Field(() => String, { nullable: true })
  persistentIdentifier!: string | null;
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
