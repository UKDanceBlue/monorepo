import { GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { PointEntryNode } from "../resources/PointEntry.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ObjectType("ListPointEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointEntryNode>,
})
export class ListPointEntriesResponse extends AbstractGraphQLPaginatedResponse<PointEntryNode> {
  @Field(() => [PointEntryNode])
  data!: PointEntryNode[];
}

@InputType()
export class CreatePointEntryInput implements Partial<PointEntryNode> {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  comment!: string | null;

  @Field(() => Int)
  points!: number;

  @Field(() => GlobalIdScalar, { nullable: true })
  personFromUuid!: GlobalId | null;

  @Field(() => GlobalIdScalar, { nullable: true })
  opportunityUuid!: GlobalId | null;

  @Field(() => GlobalIdScalar)
  teamUuid!: GlobalId;
}

@ArgsType()
export class ListPointEntriesArgs extends FilteredListQueryArgs(
  "PointEntryResolver",
  ["createdAt", "updatedAt"]
) {}
