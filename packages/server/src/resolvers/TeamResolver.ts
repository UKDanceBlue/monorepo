import { DBFundsRepository } from "#repositories/fundraising/DBFundsRepository.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { fundraisingEntryModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { marathonModelToResource } from "#repositories/marathon/marathonModelToResource.js";
import { membershipModelToResource } from "#repositories/membership/membershipModelToResource.js";
import { pointEntryModelToResource } from "#repositories/pointEntry/pointEntryModelToResource.js";
import { TeamRepository } from "#repositories/team/TeamRepository.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";
import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "#resolvers/ApiResponse.js";
import {
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  globalFundraisingAccessParam,
} from "#resolvers/FundraisingEntryResolver.js";
import * as Context from "#resolvers/context.js";

import {
  AccessControl,
  AccessLevel,
  AuthSource,
  CommitteeRole,
  DbRole,
  LegacyError,
  LegacyErrorCode,
  FilteredListQueryArgs,
  GlobalIdScalar,
  MembershipNode,
  PointEntryNode,
  SortDirection,
  TeamLegacyStatus,
  TeamNode,
  TeamType,
} from "@ukdanceblue/common";
import * as Common from "@ukdanceblue/common";
import {
  ConcreteResult,
  FormattedConcreteError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { VoidResolver } from "graphql-scalars";
import { Err, Ok, Option } from "ts-results-es";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Float,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "@freshgum/typedi";

import type { GlobalId, OptionalToNullable } from "@ukdanceblue/common";

@ObjectType("SingleTeamResponse", {
  implements: AbstractGraphQLOkResponse<TeamNode>,
})
class SingleTeamResponse extends AbstractGraphQLOkResponse<TeamNode> {
  @Field(() => TeamNode)
  data!: TeamNode;
}
@ObjectType("ListTeamsResponse", {
  implements: AbstractGraphQLPaginatedResponse<TeamNode>,
})
class ListTeamsResponse extends AbstractGraphQLPaginatedResponse<TeamNode> {
  @Field(() => [TeamNode])
  data!: TeamNode[];
}
@ObjectType("CreateTeamResponse", {
  implements: AbstractGraphQLCreatedResponse<TeamNode>,
})
class CreateTeamResponse extends AbstractGraphQLCreatedResponse<TeamNode> {
  @Field(() => TeamNode)
  data!: TeamNode;
}
@ObjectType("DeleteTeamResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteTeamResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class CreateTeamInput implements OptionalToNullable<Partial<TeamNode>> {
  @Field(() => String)
  name!: string;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;
}

@InputType()
class SetTeamInput implements OptionalToNullable<Partial<TeamNode>> {
  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => TeamLegacyStatus, { nullable: true })
  legacyStatus!: TeamLegacyStatus | null;

  @Field(() => String, { nullable: true })
  persistentIdentifier!: string | null;
}

@ArgsType()
class ListTeamsArgs extends FilteredListQueryArgs<
  "name" | "type" | "legacyStatus" | "marathonId",
  "name",
  "type" | "legacyStatus" | "marathonId",
  never,
  never,
  never
>("TeamResolver", {
  all: ["name", "type", "legacyStatus", "marathonId"],
  string: ["name"],
  numeric: [],
  oneOf: ["type", "marathonId", "legacyStatus"],
}) {
  @Field(() => [TeamType], { nullable: true })
  type!: [TeamType] | null;

  @Field(() => [TeamLegacyStatus], { nullable: true })
  legacyStatus!: [TeamLegacyStatus] | null;

  @Field(() => [DbRole], { nullable: true, deprecationReason: "Use type" })
  visibility!: [DbRole] | null;

  @Field(() => [GlobalIdScalar], { nullable: true })
  marathonId!: GlobalId[] | null;
}

@ObjectType("DbFundsTeamInfo")
class DbFundsTeamInfo {
  @Field(() => Int)
  dbNum!: number;

  @Field(() => String)
  name!: string;
}

@Resolver(() => TeamNode)
@Service([TeamRepository, FundraisingEntryRepository, DBFundsRepository])
export class TeamResolver {
  constructor(
    private teamRepository: TeamRepository,
    private fundraisingEntryRepository: FundraisingEntryRepository,
    private dbFundsRepository: DBFundsRepository
  ) {}

  @AccessControl<never, SingleTeamResponse>((_, context, result) => {
    return (
      context.authorization.accessLevel > AccessLevel.Committee ||
      context.teamMemberships.some(({ teamId, position }) =>
        result.isNone()
          ? false
          : teamId === result.value.data.id.id &&
            position === Common.MembershipPositionType.Captain
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

  @AccessControl({ accessLevel: AccessLevel.Public })
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

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier:
            Common.CommitteeIdentifier.dancerRelationsCommittee,
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

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier:
            Common.CommitteeIdentifier.dancerRelationsCommittee,
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

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier:
            Common.CommitteeIdentifier.dancerRelationsCommittee,
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

  @AccessControl(
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

  @AccessControl({ accessLevel: AccessLevel.Committee })
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

  @AccessControl(
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

  @AccessControl(globalFundraisingAccessParam, {
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

  @AccessControl({ accessLevel: AccessLevel.Public })
  @FieldResolver(() => Int)
  async totalPoints(@Root() { id: { id } }: TeamNode): Promise<number> {
    const result = await this.teamRepository.getTotalTeamPoints({
      uuid: id,
    });

    return result._sum.points ?? 0;
  }

  @AccessControl({ accessLevel: AccessLevel.Public })
  @FieldResolver(() => Common.MarathonNode)
  async marathon(
    @Root() { id: { id } }: TeamNode
  ): Promise<Common.MarathonNode> {
    const result = await this.teamRepository.getMarathon({ uuid: id });

    if (result == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Team not found");
    }

    return marathonModelToResource(result);
  }

  @AccessControl(globalFundraisingAccessParam, {
    rootMatch: [
      {
        root: "id",
        extractor: ({ teamMemberships }) =>
          teamMemberships
            .filter(
              ({ position }) =>
                position === Common.MembershipPositionType.Captain
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
        teamInfoInstance.dbNum = row.dbNum;
        teamInfoInstance.name = row.name;
        return teamInfoInstance;
      })
    );
  }

  @FieldResolver(() => Common.CommitteeIdentifier, { nullable: true })
  async committeeIdentifier(
    @Root() { id: { id } }: TeamNode
  ): Promise<Common.CommitteeIdentifier | null> {
    const result = await this.teamRepository.getTeamCommitteeIdentifier({
      uuid: id,
    });

    return result ?? null;
  }

  @AccessControl(globalFundraisingAccessParam, {
    rootMatch: [
      {
        root: "id",
        extractor: ({ teamMemberships }) =>
          teamMemberships
            .filter(
              ({ position }) =>
                position === Common.MembershipPositionType.Captain
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

  @AccessControl(globalFundraisingAccessParam)
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
      teamInfoInstance.dbNum = row.dbNum;
      teamInfoInstance.name = row.name;
      return teamInfoInstance;
    });
  }

  @AccessControl(globalFundraisingAccessParam)
  @Mutation(() => VoidResolver, { name: "assignTeamToDbFundsTeam" })
  async assignTeamToDbFundsTeam(
    @Arg("teamId", () => GlobalIdScalar) { id: teamId }: GlobalId,
    @Arg("dbFundsTeamDbNum", () => Int) dbFundsTeamDbNum: number
  ): Promise<typeof Common.VoidScalar> {
    const result = await this.dbFundsRepository.assignTeamToDbFundsTeam(
      { uuid: teamId },
      { dbNum: dbFundsTeamDbNum }
    );

    if (result.isErr()) {
      throw new FormattedConcreteError(result);
    }

    return Common.VoidScalar;
  }
}
