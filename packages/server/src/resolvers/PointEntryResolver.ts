import { Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  GlobalIdScalar,
  LegacyError,
  LegacyErrorCode,
  PersonNode,
  PointEntryNode,
  PointOpportunityNode,
  SortDirection,
  TeamNode,
} from "@ukdanceblue/common";
import {
  CreatePointEntryInput,
  ListPointEntriesArgs,
  ListPointEntriesResponse,
} from "@ukdanceblue/common";
import { ConcreteResult, NotFoundError } from "@ukdanceblue/common/error";
import { Err, None, Ok, Option, Some } from "ts-results-es";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { pointEntryModelToResource } from "#repositories/pointEntry/pointEntryModelToResource.js";
import { PointEntryRepository } from "#repositories/pointEntry/PointEntryRepository.js";
import { pointOpportunityModelToResource } from "#repositories/pointOpportunity/pointOpportunityModelToResource.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";

@Resolver(() => PointEntryNode)
@Service([PointEntryRepository, PersonRepository])
export class PointEntryResolver {
  constructor(
    private readonly pointEntryRepository: PointEntryRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @AccessControlAuthorized({
    accessLevel: AccessLevel.Committee,
  })
  @Query(() => PointEntryNode, { name: "pointEntry" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<PointEntryNode> {
    const model = await this.pointEntryRepository.findPointEntryByUnique({
      uuid: id,
    });

    if (model == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "PointEntry not found");
    }

    return pointEntryModelToResource(model);
  }

  @AccessControlAuthorized({
    accessLevel: AccessLevel.Committee,
  })
  @Query(() => ListPointEntriesResponse, { name: "pointEntries" })
  async list(
    @Args(() => ListPointEntriesArgs) query: ListPointEntriesArgs
  ): Promise<ListPointEntriesResponse> {
    const [rows, total] = await Promise.all([
      this.pointEntryRepository.listPointEntries({
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
      this.pointEntryRepository.countPointEntries({
        filters: query.filters,
      }),
    ]);

    return ListPointEntriesResponse.newPaginated({
      data: rows.map((row) => pointEntryModelToResource(row)),
      total,
      page: query.page,
      pageSize: query.actualPageSize,
    });
  }

  @AccessControlAuthorized({
    authRules: [
      {
        committeeIdentifier: CommitteeIdentifier.viceCommittee,
        minCommitteeRole: CommitteeRole.Coordinator,
      },
    ],
  })
  @Mutation(() => PointEntryNode, { name: "createPointEntry" })
  async create(
    @Arg("input") input: CreatePointEntryInput
  ): Promise<PointEntryNode> {
    const model = await this.pointEntryRepository.createPointEntry({
      points: input.points,
      comment: input.comment,
      personParam: input.personFromUuid
        ? { uuid: input.personFromUuid.id }
        : undefined,
      opportunityParam: input.opportunityUuid
        ? { uuid: input.opportunityUuid.id }
        : undefined,
      teamParam: { uuid: input.teamUuid.id },
    });

    return pointEntryModelToResource(model);
  }

  @AccessControlAuthorized({
    authRules: [
      {
        committeeIdentifier: CommitteeIdentifier.viceCommittee,
        minCommitteeRole: CommitteeRole.Coordinator,
      },
    ],
  })
  @Mutation(() => PointEntryNode, { name: "deletePointEntry" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PointEntryNode>> {
    const row = await this.pointEntryRepository.deletePointEntry({ uuid: id });

    if (row == null) {
      return Err(
        new NotFoundError({
          what: "PointEntry",
          why: `couldn't find point entry ${id}`,
        })
      );
    }

    return Ok(pointEntryModelToResource(row));
  }

  @FieldResolver(() => PersonNode, { nullable: true })
  async personFrom(
    @Root() { id: { id } }: PointEntryNode
  ): Promise<ConcreteResult<Option<PersonNode>>> {
    const model = await this.pointEntryRepository.getPointEntryPersonFrom({
      uuid: id,
    });

    return model
      ? personModelToResource(model, this.personRepository).map((val) =>
          Some(val)
        ).promise
      : Ok(None);
  }

  @FieldResolver(() => TeamNode)
  async team(
    @Root() { id: { id } }: PointEntryNode
  ): Promise<ConcreteResult<TeamNode>> {
    const model = await this.pointEntryRepository.getPointEntryTeam({
      uuid: id,
    });

    if (model == null) {
      return Err(
        new NotFoundError({
          what: "Team",
          why: `couldn't find team for point entry ${id}`,
        })
      );
    }

    return Ok(teamModelToResource(model));
  }

  @FieldResolver(() => PointOpportunityNode, { nullable: true })
  async pointOpportunity(
    @Root() { id: { id } }: PointEntryNode
  ): Promise<PointOpportunityNode | null> {
    const model = await this.pointEntryRepository.getPointEntryOpportunity({
      uuid: id,
    });

    return model ? pointOpportunityModelToResource(model) : null;
  }
}
