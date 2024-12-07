import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  CommitteeIdentifier,
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  MarathonNode,
} from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AuthSource,
  BulkTeamInput,
  GlobalIdScalar,
  LegacyError,
  LegacyErrorCode,
  MembershipNode,
  PointEntryNode,
  SolicitationCodeNode,
  SortDirection,
  TeamNode,
} from "@ukdanceblue/common";
import {
  CreateTeamInput,
  ListTeamsArgs,
  ListTeamsResponse,
  SetTeamInput,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import { AsyncResult, None, Ok, Option, Some } from "ts-results-es";
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Float,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import type { GraphQLContext } from "#auth/context.js";
import {
  fundraisingEntryModelToNode,
  solicitationCodeModelToNode,
} from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { marathonModelToResource } from "#repositories/marathon/marathonModelToResource.js";
import { membershipModelToResource } from "#repositories/membership/membershipModelToResource.js";
import { pointEntryModelToResource } from "#repositories/pointEntry/pointEntryModelToResource.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";
import { TeamRepository } from "#repositories/team/TeamRepository.js";

@Resolver(() => TeamNode)
@Service([TeamRepository, FundraisingEntryRepository])
export class TeamResolver implements CrudResolver<TeamNode, "team"> {
  constructor(
    private teamRepository: TeamRepository,
    private fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @AccessControlAuthorized("get")
  @Query(() => TeamNode, { name: "team" })
  async team(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<Option<TeamNode>>> {
    const row = await this.teamRepository.findTeamByUnique({ uuid: id });

    if (row == null) {
      return Ok(None);
    }

    return Ok(Some(teamModelToResource(row)));
  }

  @AccessControlAuthorized("list", "TeamNode")
  @Query(() => ListTeamsResponse, { name: "teams" })
  async teams(
    @Args(() => ListTeamsArgs) query: ListTeamsArgs,
    @Ctx() ctx: GraphQLContext
  ): Promise<ListTeamsResponse> {
    const marathonFilter = query.marathonId?.map(({ id: marathonId }) => ({
      uuid: marathonId,
    }));

    const [rows, total] = await Promise.all([
      this.teamRepository.listTeams({
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
        onlyDemo: ctx.authSource === AuthSource.Demo,
        legacyStatus: query.legacyStatus,
        marathon: marathonFilter,
        type: query.type,
      }),
      this.teamRepository.countTeams({
        filters: query.filters,
        onlyDemo: ctx.authSource === AuthSource.Demo,
        legacyStatus: query.legacyStatus,
        marathon: marathonFilter,
        type: query.type,
      }),
    ]);

    return ListTeamsResponse.newPaginated({
      data: rows.map((row) =>
        teamModelToResource({
          uuid: row.uuid,
          name: row.name,
          legacyStatus: row.legacyStatus,
          type: row.type,
          updatedAt: row.updatedAt,
          createdAt: row.createdAt,
        })
      ),
      total,
      page: query.page,
      pageSize: query.actualPageSize,
    });
  }

  @AccessControlAuthorized("create")
  @Mutation(() => TeamNode, { name: "createTeam" })
  async createTeam(
    @Arg("input") input: CreateTeamInput,
    @Arg("marathon", () => GlobalIdScalar) marathonUuid: GlobalId
  ): Promise<TeamNode> {
    const row = await this.teamRepository.createTeam(
      {
        name: input.name,
        type: input.type,
        legacyStatus: input.legacyStatus,
      },
      { uuid: marathonUuid.id }
    );

    return teamModelToResource(row);
  }

  @AccessControlAuthorized("update")
  @Mutation(() => TeamNode, { name: "setTeam" })
  async setTeam(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetTeamInput
  ): Promise<TeamNode> {
    const row = await this.teamRepository.updateTeam(
      { uuid: id },
      {
        uuid: id,
        name: input.name ?? undefined,
        type: input.type ?? undefined,
        legacyStatus: input.legacyStatus ?? undefined,
        persistentIdentifier: input.persistentIdentifier,
      }
    );

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Team not found");
    }

    return teamModelToResource(row);
  }

  @AccessControlAuthorized("create")
  @Mutation(() => [TeamNode], { name: "createTeams" })
  async createTeams(
    @Arg("teams", () => [BulkTeamInput]) teams: BulkTeamInput[],
    @Arg("marathonId", () => GlobalIdScalar) marathonId: GlobalId
  ): Promise<ConcreteResult<TeamNode[]>> {
    const rows = await this.teamRepository.bulkLoadTeams(teams, {
      uuid: marathonId.id,
    });

    return rows.map((rows) => rows.map((row) => teamModelToResource(row)));
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => TeamNode, { name: "deleteTeam" })
  async deleteTeam(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<TeamNode> {
    const row = await this.teamRepository.deleteTeam({ uuid: id });

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Team not found");
    }

    return teamModelToResource(row);
  }

  @AccessControlAuthorized("list", "TeamNode", ".members")
  @FieldResolver(() => [MembershipNode])
  async members(@Root() { id: { id } }: TeamNode): Promise<MembershipNode[]> {
    const memberships = await this.teamRepository.findMembersOfTeam({
      uuid: id,
    });

    return memberships.map((row) => membershipModelToResource(row));
  }

  @AccessControlAuthorized("list", "PointEntryNode")
  @FieldResolver(() => [PointEntryNode])
  async pointEntries(
    @Root() { id: { id } }: TeamNode
  ): Promise<PointEntryNode[]> {
    const rows = await this.teamRepository.getTeamPointEntries({
      uuid: id,
    });

    return rows.map((row) => pointEntryModelToResource(row));
  }

  @AccessControlAuthorized("get", "TeamNode", ".fundraisingTotal")
  @FieldResolver(() => Float, { nullable: true })
  async fundraisingTotalAmount(
    @Root() { id: { id } }: TeamNode
  ): Promise<ConcreteResult<Option<number>>> {
    return this.teamRepository.getTotalFundraisingAmount({
      uuid: id,
    });
  }

  @AccessControlAuthorized("get", "TeamNode")
  @FieldResolver(() => Int)
  async totalPoints(@Root() { id: { id } }: TeamNode): Promise<number> {
    const result = await this.teamRepository.getTotalTeamPoints({
      uuid: id,
    });

    return result._sum.points ?? 0;
  }

  @AccessControlAuthorized("get", "TeamNode")
  @FieldResolver(() => MarathonNode)
  async marathon(@Root() { id: { id } }: TeamNode): Promise<MarathonNode> {
    const result = await this.teamRepository.getMarathon({ uuid: id });

    if (result == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Team not found");
    }

    return marathonModelToResource(result);
  }

  @FieldResolver(() => CommitteeIdentifier, { nullable: true })
  async committeeIdentifier(
    @Root() { id: { id } }: TeamNode
  ): Promise<CommitteeIdentifier | null> {
    const result = await this.teamRepository.getTeamCommitteeIdentifier({
      uuid: id,
    });

    return result ?? null;
  }

  @AccessControlAuthorized("get", "TeamNode", ".fundraisingEntries")
  @FieldResolver(() => ListFundraisingEntriesResponse)
  async fundraisingEntries(
    @Root() { id: { id } }: TeamNode,
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): Promise<ConcreteResult<ListFundraisingEntriesResponse>> {
    const entries = await this.fundraisingEntryRepository.listEntries(
      {
        filters: args.filters,
        order:
          args.sortBy?.map((key, i) => [
            key,
            args.sortDirection?.[i] ?? SortDirection.desc,
          ]) ?? [],
        skip:
          args.page != null && args.actualPageSize != null
            ? (args.page - 1) * args.actualPageSize
            : null,
        take: args.actualPageSize,
      },
      {
        // EXTREMELY IMPORTANT FOR SECURITY
        forTeam: { uuid: id },
      }
    );
    const count = await this.fundraisingEntryRepository.countEntries(
      {
        filters: args.filters,
      },
      {
        forTeam: { uuid: id },
      }
    );

    if (entries.isErr()) {
      return entries;
    }
    if (count.isErr()) {
      return count;
    }

    return Ok(
      ListFundraisingEntriesResponse.newPaginated({
        data: await Promise.all(
          entries.value.map((model) => fundraisingEntryModelToNode(model))
        ),
        total: count.value,
        page: args.page,
        pageSize: args.actualPageSize,
      })
    );
  }

  @AccessControlAuthorized("get", "TeamNode", ".solicitationCode")
  @FieldResolver(() => SolicitationCodeNode, { nullable: true })
  async solicitationCode(
    @Root() { id: { id } }: TeamNode
  ): Promise<ConcreteResult<Option<SolicitationCodeNode>>> {
    return new AsyncResult(
      this.teamRepository.getSolicitationCodeForTeam({
        uuid: id,
      })
    ).map((row) => row.map(solicitationCodeModelToNode)).promise;
  }
}
