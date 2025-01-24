import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  GlobalIdScalar,
  LegacyError,
  LegacyErrorCode,
  PersonNode,
  PointEntryNode,
  PointOpportunityNode,
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

import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { pointEntryModelToResource } from "#repositories/pointEntry/pointEntryModelToResource.js";
import { PointEntryRepository } from "#repositories/pointEntry/PointEntryRepository.js";
import { pointOpportunityModelToResource } from "#repositories/pointOpportunity/pointOpportunityModelToResource.js";
import type { AsyncRepositoryResult } from "#repositories/shared.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";

@Resolver(() => PointEntryNode)
@Service([PointEntryRepository, PersonRepository])
export class PointEntryResolver
  implements CrudResolver<PointEntryNode, "pointEntry", "pointEntries">
{
  constructor(
    private readonly pointEntryRepository: PointEntryRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @AccessControlAuthorized("get", ["getId", "PointEntryNode", "id"])
  @Query(() => PointEntryNode, { name: "pointEntry" })
  async pointEntry(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<PointEntryNode> {
    const model = await this.pointEntryRepository.findPointEntryByUnique({
      uuid: id,
    });

    if (model == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "PointEntry not found");
    }

    return pointEntryModelToResource(model);
  }

  @AccessControlAuthorized("list", ["every", "PointEntryNode"])
  @Query(() => ListPointEntriesResponse, { name: "pointEntries" })
  pointEntries(
    @Args(() => ListPointEntriesArgs) query: ListPointEntriesArgs
  ): AsyncRepositoryResult<ListPointEntriesResponse> {
    return this.pointEntryRepository
      .findAndCount({
        filters: query.filters,
        sortBy: query.sortBy,
        offset: query.offset,
        limit: query.limit,
        search: query.search,
      })
      .map(({ selectedRows, total }) => {
        return ListPointEntriesResponse.newPaginated({
          data: selectedRows.map((row) => pointEntryModelToResource(row)),
          total,
        });
      });
  }

  @AccessControlAuthorized("create", ["every", "PointEntryNode"])
  @Mutation(() => PointEntryNode, { name: "createPointEntry" })
  @WithAuditLogging()
  async createPointEntry(
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

  @AccessControlAuthorized("delete", ["getId", "PointEntryNode", "id"])
  @Mutation(() => PointEntryNode, { name: "deletePointEntry" })
  @WithAuditLogging()
  async deletePointEntry(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<PointEntryNode>> {
    const row = await this.pointEntryRepository.deletePointEntry({ uuid: id });

    if (row == null) {
      return Err(
        new NotFoundError("PointEntry", `couldn't find point entry ${id}`)
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
        new NotFoundError("Team", `couldn't find team for point entry ${id}`)
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
