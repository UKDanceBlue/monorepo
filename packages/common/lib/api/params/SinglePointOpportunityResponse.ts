import { DateTimeISOResolver } from "graphql-scalars";
import { ObjectType, Field, InputType, ArgsType } from "type-graphql";
import {
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  AbstractGraphQLCreatedResponse,
} from "./ApiResponse.js";
import { PointOpportunityNode } from "../resources/PointOpportunity.js";
import { TeamType } from "../resources/Team.js";
import { GlobalIdScalar, type GlobalId } from "../scalars/GlobalId.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";

@ObjectType("SinglePointOpportunityResponse", {
  implements: AbstractGraphQLOkResponse<PointOpportunityNode>,
})
export class SinglePointOpportunityResponse extends AbstractGraphQLOkResponse<PointOpportunityNode> {
  @Field(() => PointOpportunityNode)
  data!: PointOpportunityNode;
}
@ObjectType("ListPointOpportunitiesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointOpportunityNode>,
})
export class ListPointOpportunitiesResponse extends AbstractGraphQLPaginatedResponse<PointOpportunityNode> {
  @Field(() => [PointOpportunityNode])
  data!: PointOpportunityNode[];
}
@ObjectType("CreatePointOpportunityResponse", {
  implements: AbstractGraphQLCreatedResponse<PointOpportunityNode>,
})
export class CreatePointOpportunityResponse extends AbstractGraphQLCreatedResponse<PointOpportunityNode> {
  @Field(() => PointOpportunityNode)
  data!: PointOpportunityNode;
}
@ObjectType("DeletePointOpportunityResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class DeletePointOpportunityResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
export class CreatePointOpportunityInput {
  @Field(() => String)
  name!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  opportunityDate!: Date | null;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => GlobalIdScalar, { nullable: true })
  eventUuid!: GlobalId | null;

  @Field(() => GlobalIdScalar)
  marathonUuid!: GlobalId;
}

@InputType()
export class SetPointOpportunityInput {
  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  opportunityDate!: Date | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => GlobalIdScalar, { nullable: true })
  eventUuid!: GlobalId | null;
}

@ArgsType()
export class ListPointOpportunitiesArgs extends FilteredListQueryArgs<
  | "name"
  | "opportunityDate"
  | "type"
  | "createdAt"
  | "updatedAt"
  | "marathonUuid",
  "name",
  "type" | "marathonUuid",
  never,
  "opportunityDate" | "createdAt" | "updatedAt",
  never
>("PointOpportunityResolver", {
  all: [
    "name",
    "opportunityDate",
    "type",
    "createdAt",
    "updatedAt",
    "marathonUuid",
  ],
  oneOf: ["type", "marathonUuid"],
  string: ["name"],
  date: ["opportunityDate", "createdAt", "updatedAt"],
}) {}
