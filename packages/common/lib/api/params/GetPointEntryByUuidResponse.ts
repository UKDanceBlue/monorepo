import { ArgsType,Field, InputType, Int, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { PointEntryNode } from "../resources/PointEntry.js";
import { type GlobalId,GlobalIdScalar } from "../scalars/GlobalId.js";
import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

@ObjectType("GetPointEntryByUuidResponse", {
  implements: AbstractGraphQLOkResponse<PointEntryNode>,
})
export class GetPointEntryByUuidResponse extends AbstractGraphQLOkResponse<PointEntryNode> {
  @Field(() => PointEntryNode)
  data!: PointEntryNode;
}
@ObjectType("ListPointEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointEntryNode>,
})
export class ListPointEntriesResponse extends AbstractGraphQLPaginatedResponse<PointEntryNode> {
  @Field(() => [PointEntryNode])
  data!: PointEntryNode[];
}
@ObjectType("CreatePointEntryResponse", {
  implements: AbstractGraphQLCreatedResponse<PointEntryNode>,
})
export class CreatePointEntryResponse extends AbstractGraphQLCreatedResponse<PointEntryNode> {
  @Field(() => PointEntryNode)
  data!: PointEntryNode;
}
@ObjectType("DeletePointEntryResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class DeletePointEntryResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
export class CreatePointEntryInput implements Partial<PointEntryNode> {
  @Field(() => String, { nullable: true })
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
export class ListPointEntriesArgs extends FilteredListQueryArgs<
  "createdAt" | "updatedAt",
  never,
  never,
  never,
  "createdAt" | "updatedAt",
  never
>("PointEntryResolver", {
  all: ["createdAt", "updatedAt"],
  date: ["createdAt", "updatedAt"],
}) {}
