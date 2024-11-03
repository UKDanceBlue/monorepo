import { Service } from "@freshgum/typedi";
import { CommitteeRole } from "@prisma/client";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessLevel,
  CommitteeIdentifier,
  EventNode,
  GlobalIdScalar,
  LegacyError,
  LegacyErrorCode,
  MutationAccessControl,
  PointOpportunityNode,
  QueryAccessControl,
  SortDirection,
} from "@ukdanceblue/common";
import {
  CreatePointOpportunityInput,
  CreatePointOpportunityResponse,
  DeletePointOpportunityResponse,
  ListPointOpportunitiesArgs,
  ListPointOpportunitiesResponse,
  SetPointOpportunityInput,
  SinglePointOpportunityResponse,
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
export class PointOpportunityResolver {
  constructor(
    private readonly pointOpportunityRepository: PointOpportunityRepository
  ) {}

  @QueryAccessControl({
    accessLevel: AccessLevel.Committee,
  })
  @Query(() => SinglePointOpportunityResponse, { name: "pointOpportunity" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<SinglePointOpportunityResponse> {
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

    return SinglePointOpportunityResponse.newOk(
      pointOpportunityModelToResource(row)
    );
  }

  @QueryAccessControl({
    accessLevel: AccessLevel.Committee,
  })
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

  @MutationAccessControl({
    authRules: [
      {
        committeeIdentifier: CommitteeIdentifier.viceCommittee,
        minCommitteeRole: CommitteeRole.Coordinator,
      },
    ],
  })
  @Mutation(() => CreatePointOpportunityResponse, {
    name: "createPointOpportunity",
  })
  async create(
    @Arg("input") input: CreatePointOpportunityInput
  ): Promise<CreatePointOpportunityResponse> {
    const row = await this.pointOpportunityRepository.createPointOpportunity({
      name: input.name,
      type: input.type,
      eventParam: input.eventUuid ? { uuid: input.eventUuid.id } : null,
      opportunityDate: input.opportunityDate ?? null,
      marathon: { uuid: input.marathonUuid.id },
    });

    return CreatePointOpportunityResponse.newCreated(
      pointOpportunityModelToResource(row)
    );
  }

  @MutationAccessControl({
    authRules: [
      {
        committeeIdentifier: CommitteeIdentifier.viceCommittee,
        minCommitteeRole: CommitteeRole.Coordinator,
      },
    ],
  })
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

    return SinglePointOpportunityResponse.newOk(
      pointOpportunityModelToResource(row)
    );
  }

  @MutationAccessControl({
    authRules: [
      {
        committeeIdentifier: CommitteeIdentifier.viceCommittee,
        minCommitteeRole: CommitteeRole.Coordinator,
      },
    ],
  })
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
      throw new LegacyError(
        LegacyErrorCode.NotFound,
        "PointOpportunity not found"
      );
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
