import type { GlobalId } from "@ukdanceblue/common";
import {
  DetailedError,
  ErrorCode,
  EventNode,
  FilteredListQueryArgs,
  GlobalIdScalar,
  PointOpportunityNode,
  SortDirection,
  TeamType,
} from "@ukdanceblue/common";
import { DateTimeISOResolver } from "graphql-scalars";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
import { eventModelToResource } from "#repositories/event/eventModelToResource.js";
import { PointOpportunityRepository } from "#repositories/pointOpportunity/PointOpportunityRepository.js";
import { pointOpportunityModelToResource } from "#repositories/pointOpportunity/pointOpportunityModelToResource.js";


@ObjectType("SinglePointOpportunityResponse", {
  implements: AbstractGraphQLOkResponse<PointOpportunityNode>,
})
class SinglePointOpportunityResponse extends AbstractGraphQLOkResponse<PointOpportunityNode> {
  @Field(() => PointOpportunityNode)
  data!: PointOpportunityNode;
}
@ObjectType("ListPointOpportunitiesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointOpportunityNode>,
})
class ListPointOpportunitiesResponse extends AbstractGraphQLPaginatedResponse<PointOpportunityNode> {
  @Field(() => [PointOpportunityNode])
  data!: PointOpportunityNode[];
}
@ObjectType("CreatePointOpportunityResponse", {
  implements: AbstractGraphQLCreatedResponse<PointOpportunityNode>,
})
class CreatePointOpportunityResponse extends AbstractGraphQLCreatedResponse<PointOpportunityNode> {
  @Field(() => PointOpportunityNode)
  data!: PointOpportunityNode;
}
@ObjectType("DeletePointOpportunityResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePointOpportunityResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class CreatePointOpportunityInput {
  @Field(() => String)
  name!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  opportunityDate!: Date | null;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => ID, { nullable: true })
  eventUuid!: string | null;
}

@InputType()
class SetPointOpportunityInput {
  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  opportunityDate!: Date | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => ID, { nullable: true })
  eventUuid!: string | null;
}

@ArgsType()
class ListPointOpportunitiesArgs extends FilteredListQueryArgs<
  "name" | "opportunityDate" | "type" | "createdAt" | "updatedAt",
  "name",
  "type",
  never,
  "opportunityDate" | "createdAt" | "updatedAt",
  never
>("PointOpportunityResolver", {
  all: ["name", "opportunityDate", "type", "createdAt", "updatedAt"],
  oneOf: ["type"],
  string: ["name"],
  date: ["opportunityDate", "createdAt", "updatedAt"],
}) {}

@Resolver(() => PointOpportunityNode)
@Service()
export class PointOpportunityResolver {
  constructor(
    private readonly pointOpportunityRepository: PointOpportunityRepository
  ) {}

  @Query(() => SinglePointOpportunityResponse, { name: "pointOpportunity" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<SinglePointOpportunityResponse> {
    const row =
      await this.pointOpportunityRepository.findPointOpportunityByUnique({
        uuid: id,
      });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointOpportunity not found");
    }

    return SinglePointOpportunityResponse.newOk(
      pointOpportunityModelToResource(row)
    );
  }

  @Query(() => ListPointOpportunitiesResponse, { name: "pointOpportunities" })
  async list(
    @Args(() => ListPointOpportunitiesArgs) query: ListPointOpportunitiesArgs
  ): Promise<ListPointOpportunitiesResponse> {
    const [rows, total] = await Promise.all([
      this.pointOpportunityRepository.listPointOpportunities({
        filters: query.filters,
        order:
          query.sortBy?.map((key, i) => [
            key,
            query.sortDirection?.[i] ?? SortDirection.desc,
          ]) ?? [],
        skip:
          query.page != null && query.pageSize != null
            ? (query.page - 1) * query.pageSize
            : null,
        take: query.pageSize,
      }),
      this.pointOpportunityRepository.countPointOpportunities({
        filters: query.filters,
      }),
    ]);

    return ListPointOpportunitiesResponse.newPaginated({
      data: rows.map((row) => pointOpportunityModelToResource(row)),
      total,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => CreatePointOpportunityResponse, {
    name: "createPointOpportunity",
  })
  async create(
    @Arg("input") input: CreatePointOpportunityInput
  ): Promise<CreatePointOpportunityResponse> {
    const row = await this.pointOpportunityRepository.createPointOpportunity({
      name: input.name,
      type: input.type,
      eventParam: input.eventUuid ? { uuid: input.eventUuid } : null,
      opportunityDate: input.opportunityDate ?? null,
    });

    return CreatePointOpportunityResponse.newOk(
      pointOpportunityModelToResource(row)
    );
  }

  @Mutation(() => SinglePointOpportunityResponse, {
    name: "setPointOpportunity",
  })
  async set(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetPointOpportunityInput
  ): Promise<SinglePointOpportunityResponse> {
    const row = await this.pointOpportunityRepository.updatePointOpportunity(
      { uuid: id },
      {
        name: input.name ?? undefined,
        type: input.type ?? undefined,
        eventParam: input.eventUuid ? { uuid: input.eventUuid } : undefined,
        opportunityDate: input.opportunityDate ?? undefined,
      }
    );

    if (!row) {
      throw new DetailedError(ErrorCode.NotFound, "PointOpportunity not found");
    }

    return SinglePointOpportunityResponse.newOk(
      pointOpportunityModelToResource(row)
    );
  }

  @Mutation(() => DeletePointOpportunityResponse, {
    name: "deletePointOpportunity",
  })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeletePointOpportunityResponse> {
    const row = await this.pointOpportunityRepository.deletePointOpportunity({
      uuid: id,
    });

    if (!row) {
      throw new DetailedError(ErrorCode.NotFound, "PointOpportunity not found");
    }

    return DeletePointOpportunityResponse.newOk(true);
  }

  @FieldResolver(() => EventNode, { nullable: true })
  async event(
    @Root() { id: { id } }: PointOpportunityNode
  ): Promise<EventNode | null> {
    const model =
      await this.pointOpportunityRepository.getEventForPointOpportunity({
        uuid: id,
      });

    return model ? eventModelToResource(model) : null;
  }
}
