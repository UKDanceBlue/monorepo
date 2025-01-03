import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  EventNode,
  GlobalIdScalar,
  LegacyError,
  LegacyErrorCode,
  PointOpportunityNode,
  SortDirection,
  TeamType,
} from "@ukdanceblue/common";
import {
  CreatePointOpportunityInput,
  ListPointOpportunitiesArgs,
  ListPointOpportunitiesResponse,
  SetPointOpportunityInput,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { eventModelToResource } from "#repositories/event/eventModelToResource.js";
import { pointOpportunityModelToResource } from "#repositories/pointOpportunity/pointOpportunityModelToResource.js";
import { PointOpportunityRepository } from "#repositories/pointOpportunity/PointOpportunityRepository.js";

@Resolver(() => PointOpportunityNode)
@Service([PointOpportunityRepository])
export class PointOpportunityResolver
  implements
    CrudResolver<PointOpportunityNode, "pointOpportunity", "pointOpportunities">
{
  constructor(
    private readonly pointOpportunityRepository: PointOpportunityRepository
  ) {}

  @AccessControlAuthorized("get")
  @Query(() => PointOpportunityNode, { name: "pointOpportunity" })
  async pointOpportunity(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<PointOpportunityNode> {
    const row =
      await this.pointOpportunityRepository.findPointOpportunityByUnique({
        uuid: id,
      });

    if (row == null) {
      throw new LegacyError(
        LegacyErrorCode.NotFound,
        "PointOpportunity not found"
      );
    }

    return pointOpportunityModelToResource(row);
  }

  @AccessControlAuthorized("list", "PointOpportunityNode")
  @Query(() => ListPointOpportunitiesResponse, { name: "pointOpportunities" })
  async pointOpportunities(
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
          query.page != null && query.actualPageSize != null
            ? (query.page - 1) * query.actualPageSize
            : null,
        take: query.actualPageSize,
      }),
      this.pointOpportunityRepository.countPointOpportunities({
        filters: query.filters,
      }),
    ]);

    return ListPointOpportunitiesResponse.newPaginated({
      data: rows.map((row) => pointOpportunityModelToResource(row)),
      total,
      page: query.page,
      pageSize: query.actualPageSize,
    });
  }

  @AccessControlAuthorized("create")
  @Mutation(() => PointOpportunityNode, {
    name: "createPointOpportunity",
  })
  async createPointOpportunity(
    @Arg("input") input: CreatePointOpportunityInput
  ): Promise<PointOpportunityNode> {
    if (input.type === TeamType.Mini) {
      throw new LegacyError(
        LegacyErrorCode.InvalidRequest,
        "Mini teams cannot have point opportunities"
      );
    }
    const row = await this.pointOpportunityRepository.createPointOpportunity({
      name: input.name,
      type: input.type,
      eventParam: input.eventUuid ? { uuid: input.eventUuid.id } : null,
      opportunityDate: input.opportunityDate ?? null,
      marathon: { uuid: input.marathonUuid.id },
    });

    return pointOpportunityModelToResource(row);
  }

  @AccessControlAuthorized("update")
  @Mutation(() => PointOpportunityNode, {
    name: "setPointOpportunity",
  })
  async setPointOpportunity(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetPointOpportunityInput
  ): Promise<PointOpportunityNode> {
    if (input.type === TeamType.Mini) {
      throw new LegacyError(
        LegacyErrorCode.InvalidRequest,
        "Mini teams cannot have point opportunities"
      );
    }
    const row = await this.pointOpportunityRepository.updatePointOpportunity(
      { uuid: id },
      {
        name: input.name ?? undefined,
        type: input.type ?? undefined,
        eventParam: input.eventUuid ? { uuid: input.eventUuid.id } : undefined,
        opportunityDate: input.opportunityDate ?? undefined,
      }
    );

    if (!row) {
      throw new LegacyError(
        LegacyErrorCode.NotFound,
        "PointOpportunity not found"
      );
    }

    return pointOpportunityModelToResource(row);
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => PointOpportunityNode, {
    name: "deletePointOpportunity",
  })
  async deletePointOpportunity(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<PointOpportunityNode> {
    const row = await this.pointOpportunityRepository.deletePointOpportunity({
      uuid: id,
    });

    if (!row) {
      throw new LegacyError(
        LegacyErrorCode.NotFound,
        "PointOpportunity not found"
      );
    }

    return pointOpportunityModelToResource(row);
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
