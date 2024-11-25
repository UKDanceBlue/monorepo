import { Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  CommitteeIdentifier,
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  MarathonNode,
  MembershipPositionType,
} from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  AccessLevel,
  AuthSource,
  BulkTeamInput,
  CommitteeRole,
  CustomQueryAccessControl,
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
  CreateTeamResponse,
  DbFundsTeamInfo,
  DeleteTeamResponse,
  ListTeamsArgs,
  ListTeamsResponse,
  SetTeamInput,
  SingleTeamResponse,
} from "@ukdanceblue/common";
import {
  ConcreteResult,
  FormattedConcreteError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { AsyncResult, Err, Ok, Option } from "ts-results-es";
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

import { DBFundsRepository } from "#repositories/fundraising/DBFundsRepository.js";
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
import * as Context from "#resolvers/context.js";

import { globalFundraisingAccessParam } from "./accessParams.js";

@Resolver(() => TeamNode)
@Service([TeamRepository, FundraisingEntryRepository, DBFundsRepository])
export class TeamResolver {
  constructor(
    private teamRepository: TeamRepository,
    private fundraisingEntryRepository: FundraisingEntryRepository,
    private dbFundsRepository: DBFundsRepository
  ) {}

  @CustomQueryAccessControl<never, SingleTeamResponse>((_, context, result) => {
    return (
      context.authorization.accessLevel > AccessLevel.Committee ||
      context.teamMemberships.some(({ teamId, position }) =>
        result.isNone()
          ? false
          : teamId === result.value.data.id.id &&
            position === MembershipPositionType.Captain
      )
    );
  })
  @Query(() => SingleTeamResponse, { name: "team" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<SingleTeamResponse>> {
    const row = await this.teamRepository.findTeamByUnique({ uuid: id });

    if (row == null) {
      return Err(new NotFoundError({ what: "Team" }));
    }

    return Ok(SingleTeamResponse.newOk(teamModelToResource(row)));
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.Public })
  @Query(() => ListTeamsResponse, { name: "teams" })
  async list(
    @Args(() => ListTeamsArgs) query: ListTeamsArgs,
    @Ctx() ctx: Context.GraphQLContext
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
        onlyDemo: ctx.userData.authSource === AuthSource.Demo,
        legacyStatus: query.legacyStatus,
        marathon: marathonFilter,
        type: query.type,
      }),
      this.teamRepository.countTeams({
        filters: query.filters,
        onlyDemo: ctx.userData.authSource === AuthSource.Demo,
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

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
          minCommitteeRole: CommitteeRole.Coordinator,
        },
      ],
    }
  )
  @Mutation(() => CreateTeamResponse, { name: "createTeam" })
  async create(
    @Arg("input") input: CreateTeamInput,
    @Arg("marathon", () => GlobalIdScalar) marathonUuid: GlobalId
  ): Promise<CreateTeamResponse> {
    const row = await this.teamRepository.createTeam(
      {
        name: input.name,
        type: input.type,
        legacyStatus: input.legacyStatus,
      },
      { uuid: marathonUuid.id }
    );

    return CreateTeamResponse.newCreated(teamModelToResource(row));
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
          minCommitteeRole: CommitteeRole.Coordinator,
        },
      ],
    }
  )
  @Mutation(() => SingleTeamResponse, { name: "setTeam" })
  async set(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetTeamInput
  ): Promise<SingleTeamResponse> {
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

    return SingleTeamResponse.newOk(teamModelToResource(row));
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
          minCommitteeRole: CommitteeRole.Chair,
        },
      ],
    }
  )
  @Mutation(() => [TeamNode], { name: "bulkLoadTeams" })
  async bulkLoad(
    @Arg("teams", () => [BulkTeamInput]) teams: BulkTeamInput[],
    @Arg("marathonId", () => GlobalIdScalar) marathonId: GlobalId
  ): Promise<ConcreteResult<TeamNode[]>> {
    const rows = await this.teamRepository.bulkLoadTeams(teams, {
      uuid: marathonId.id,
    });

    return rows.map((rows) => rows.map((row) => teamModelToResource(row)));
  }

  @AccessControlAuthorized(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
          minCommitteeRole: CommitteeRole.Coordinator,
        },
      ],
    }
  )
  @Mutation(() => DeleteTeamResponse, { name: "deleteTeam" })
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeleteTeamResponse> {
    const row = await this.teamRepository.deleteTeam({ uuid: id });

    if (row == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Team not found");
    }

    return DeleteTeamResponse.newOk(true);
  }

  @AccessControlAuthorized(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ teamMemberships }) =>
            teamMemberships.map(({ teamId }) => teamId),
        },
      ],
    }
  )
  @FieldResolver(() => [MembershipNode])
  async members(@Root() { id: { id } }: TeamNode): Promise<MembershipNode[]> {
    const memberships = await this.teamRepository.findMembersOfTeam({
      uuid: id,
    });

    return memberships.map((row) => membershipModelToResource(row));
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.Committee })
  @FieldResolver(() => [MembershipNode], {
    deprecationReason: "Just query the members field and filter by role",
  })
  async captains(@Root() { id: { id } }: TeamNode): Promise<MembershipNode[]> {
    const memberships = await this.teamRepository.findMembersOfTeam(
      { uuid: id },
      { captainsOnly: true }
    );

    return memberships.map((row) => membershipModelToResource(row));
  }

  @AccessControlAuthorized(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "id",
          extractor: ({ teamMemberships }) =>
            teamMemberships.map(({ teamId }) => teamId),
        },
      ],
    }
  )
  @FieldResolver(() => [PointEntryNode])
  async pointEntries(
    @Root() { id: { id } }: TeamNode
  ): Promise<PointEntryNode[]> {
    const rows = await this.teamRepository.getTeamPointEntries({
      uuid: id,
    });

    return rows.map((row) => pointEntryModelToResource(row));
  }

  @AccessControlAuthorized(globalFundraisingAccessParam, {
    rootMatch: [
      {
        root: "id",
        extractor: ({ teamMemberships }) =>
          teamMemberships.map(({ teamId }) => teamId),
      },
    ],
  })
  @FieldResolver(() => Float, { nullable: true })
  async fundraisingTotalAmount(
    @Root() { id: { id } }: TeamNode
  ): Promise<ConcreteResult<Option<number>>> {
    return this.teamRepository.getTotalFundraisingAmount({
      uuid: id,
    });
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.Public })
  @FieldResolver(() => Int)
  async totalPoints(@Root() { id: { id } }: TeamNode): Promise<number> {
    const result = await this.teamRepository.getTotalTeamPoints({
      uuid: id,
    });

    return result._sum.points ?? 0;
  }

  @AccessControlAuthorized({ accessLevel: AccessLevel.Public })
  @FieldResolver(() => MarathonNode)
  async marathon(@Root() { id: { id } }: TeamNode): Promise<MarathonNode> {
    const result = await this.teamRepository.getMarathon({ uuid: id });

    if (result == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Team not found");
    }

    return marathonModelToResource(result);
  }

  @AccessControlAuthorized(globalFundraisingAccessParam, {
    rootMatch: [
      {
        root: "id",
        extractor: ({ teamMemberships }) =>
          teamMemberships
            .filter(
              ({ position }) => position === MembershipPositionType.Captain
            )
            .map(({ teamId }) => teamId),
      },
    ],
  })
  @FieldResolver(() => DbFundsTeamInfo, { nullable: true })
  async dbFundsTeam(
    @Root() { id: { id } }: TeamNode
  ): Promise<ConcreteResult<Option<DbFundsTeamInfo>>> {
    const result = await this.dbFundsRepository.getDbFundsTeamForTeam({
      uuid: id,
    });

    return result.map((row) =>
      row.map((row) => {
        const teamInfoInstance = new DbFundsTeamInfo();
        teamInfoInstance.dbNum = row.solicitationCode.code;
        teamInfoInstance.name = row.name;
        return teamInfoInstance;
      })
    );
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

  @AccessControlAuthorized(globalFundraisingAccessParam, {
    rootMatch: [
      {
        root: "id",
        extractor: ({ teamMemberships }) =>
          teamMemberships
            .filter(
              ({ position }) => position === MembershipPositionType.Captain
            )
            .map(({ teamId }) => teamId),
      },
    ],
  })
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

  @AccessControlAuthorized(globalFundraisingAccessParam)
  @Query(() => [DbFundsTeamInfo], { name: "dbFundsTeams" })
  async dbFundsTeams(
    @Arg("search") search: string
  ): Promise<DbFundsTeamInfo[]> {
    const searchParam: {
      byDbNum?: number;
      byName?: string;
    } = {};
    const searchAsNum = Number.parseInt(search, 10);
    if (Number.isInteger(searchAsNum)) {
      searchParam.byDbNum = searchAsNum;
    } else {
      searchParam.byName = search;
    }
    const rows = await this.dbFundsRepository.listDbFundsTeams({
      ...searchParam,
      onlyActive: true,
    });

    if (rows.isErr()) {
      throw new FormattedConcreteError(rows);
    }

    return rows.value.map((row) => {
      const teamInfoInstance = new DbFundsTeamInfo();
      teamInfoInstance.dbNum = row.solicitationCode.code;
      teamInfoInstance.name = row.name;
      return teamInfoInstance;
    });
  }

  @AccessControlAuthorized(globalFundraisingAccessParam)
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
