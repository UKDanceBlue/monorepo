import { GraphQLNonEmptyString } from "graphql-scalars";
import { DateTime } from "luxon";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { PointOpportunityNode } from "../resources/PointOpportunity.js";
import { TeamType } from "../resources/Team.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ObjectType("ListPointOpportunitiesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointOpportunityNode>,
})
export class ListPointOpportunitiesResponse extends AbstractGraphQLPaginatedResponse<PointOpportunityNode> {
  @Field(() => [PointOpportunityNode])
  data!: PointOpportunityNode[];
}

@InputType()
export class CreatePointOpportunityInput {
  @Field(() => GraphQLNonEmptyString)
  name!: string;

  @Field(() => DateTimeScalar, { nullable: true })
  opportunityDate!: DateTime | null;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => GlobalIdScalar, { nullable: true })
  eventUuid!: GlobalId | null;

  @Field(() => GlobalIdScalar)
  marathonUuid!: GlobalId;
}

@InputType()
export class SetPointOpportunityInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name!: string | null;

  @Field(() => DateTimeScalar, { nullable: true })
  opportunityDate!: DateTime | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => GlobalIdScalar, { nullable: true })
  eventUuid!: GlobalId | null;
}

@ArgsType()
export class ListPointOpportunitiesArgs extends FilteredListQueryArgs(
  "PointOpportunityResolver",
  ["name", "opportunityDate", "type", "createdAt", "updatedAt", "marathonUuid"]
) {}
