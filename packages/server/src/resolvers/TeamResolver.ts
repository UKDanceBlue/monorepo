import type {
  MarathonYearString,
  OptionalToNullable,
} from "@ukdanceblue/common";
import * as Common from "@ukdanceblue/common";
import {
  AccessControl,
  AccessLevel,
  AuthSource,
  CommitteeRole,
  DbRole,
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  MembershipNode,
  PointEntryNode,
  SortDirection,
  TeamLegacyStatus,
  TeamNode,
  TeamType,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

import { CatchableConcreteError } from "../lib/formatError.js";
import { DBFundsRepository } from "../repositories/fundraising/DBFundsRepository.js";
import { FundraisingEntryRepository } from "../repositories/fundraising/FundraisingRepository.js";
import { fundraisingEntryModelToNode } from "../repositories/fundraising/fundraisingEntryModelToNode.js";
import { marathonModelToResource } from "../repositories/marathon/marathonModelToResource.js";
import { membershipModelToResource } from "../repositories/membership/membershipModelToResource.js";
import { pointEntryModelToResource } from "../repositories/pointEntry/pointEntryModelToResource.js";
import { TeamRepository } from "../repositories/team/TeamRepository.js";
import { teamModelToResource } from "../repositories/team/teamModelToResource.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
import {
  ListFundraisingEntriesArgs,
  ListFundraisingEntriesResponse,
  globalFundraisingAccessParam,
} from "./FundraisingEntryResolver.js";
import * as Context from "./context.js";

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
  marathonYear!: MarathonYearString | null;

  @Field(() => String, { nullable: true })
  persistentIdentifier!: string | null;
}

@ArgsType()
class ListTeamsArgs extends FilteredListQueryArgs<
  "name" | "type" | "legacyStatus" | "marathonYear",
  "name",
  "type" | "legacyStatus" | "marathonYear",
  never,
  never,
  never
>("TeamResolver", {
  all: ["name", "type", "legacyStatus", "marathonYear"],
  string: ["name"],
  numeric: [],
  oneOf: ["type", "marathonYear", "legacyStatus"],
}) {
  @Field(() => [TeamType], { nullable: true })
  type!: [TeamType] | null;

  @Field(() => [TeamLegacyStatus], { nullable: true })
  legacyStatus!: [TeamLegacyStatus] | null;

  @Field(() => [DbRole], { nullable: true, deprecationReason: "Use type" })
  visibility!: [DbRole] | null;

  @Field(() => [String], { nullable: true })
  marathonYear!: MarathonYearString[] | null;
}

@ObjectType("DbFundsTeamInfo", { implements: [Common.Node] })
class DbFundsTeamInfo {
  @Field(() => Int)
  dbNum!: number;

  @Field(() => String)
  name!: string;
}

@Resolver(() => TeamNode)
@Service()
export class TeamResolver {
  constructor(
    private teamRepository: TeamRepository,
    private fundraisingEntryRepository: FundraisingEntryRepository,
    private dbFundsRepository: DBFundsRepository
  ) {}

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => SingleTeamResponse, { name: "team" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<SingleTeamResponse> {
    const row = await this.teamRepository.findTeamByUnique({ uuid });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    return SingleTeamResponse.newOk(teamModelToResource(row));
  }

  @AccessControl({ accessLevel: AccessLevel.Public })
  @Query(() => ListTeamsResponse, { name: "teams" })
  async list(
    @Args(() => ListTeamsArgs) query: ListTeamsArgs,
    @Ctx() ctx: Context.GraphQLContext
  ): Promise<ListTeamsResponse> {
    const [rows, total] = await Promise.all([
      this.teamRepository.listTeams({
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
        onlyDemo: ctx.userData.authSource === AuthSource.Demo,
        legacyStatus: query.legacyStatus,
        marathon: query.marathonYear?.map((year) => ({ year })),
        type: query.type,
      }),
      this.teamRepository.countTeams({
        filters: query.filters,
        onlyDemo: ctx.userData.authSource === AuthSource.Demo,
        legacyStatus: query.legacyStatus,
        marathon: query.marathonYear?.map((year) => ({ year })),
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
      pageSize: query.pageSize,
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
            Common.CommitteeIdentifier["dancerRelationsCommittee"],
          minCommitteeRole: CommitteeRole.Coordinator,
        },
      ],
    }
  )
  @Mutation(() => CreateTeamResponse, { name: "createTeam" })
  async create(
    @Arg("input") input: CreateTeamInput,
    @Arg("marathon") marathonUuid: string
  ): Promise<CreateTeamResponse> {
    const row = await this.teamRepository.createTeam(
      {
        name: input.name,
        type: input.type,
        legacyStatus: input.legacyStatus,
      },
      { uuid: marathonUuid }
    );

    return CreateTeamResponse.newCreated(teamModelToResource(row), row.uuid);
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [
        {
          committeeIdentifier:
            Common.CommitteeIdentifier["dancerRelationsCommittee"],
          minCommitteeRole: CommitteeRole.Coordinator,
        },
      ],
    }
  )
  @Mutation(() => SingleTeamResponse, { name: "setTeam" })
  async set(
    @Arg("uuid") uuid: string,
    @Arg("input") input: SetTeamInput
  ): Promise<SingleTeamResponse> {
    const row = await this.teamRepository.updateTeam(
      { uuid },
      {
        uuid,
        name: input.name ?? undefined,
        type: input.type ?? undefined,
        legacyStatus: input.legacyStatus ?? undefined,
        persistentIdentifier: input.persistentIdentifier,
      }
    );

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
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
            Common.CommitteeIdentifier["dancerRelationsCommittee"],
          minCommitteeRole: CommitteeRole.Coordinator,
        },
      ],
    }
  )
  @Mutation(() => DeleteTeamResponse, { name: "deleteTeam" })
  async delete(@Arg("uuid") uuid: string): Promise<DeleteTeamResponse> {
    const row = await this.teamRepository.deleteTeam({ uuid });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
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
  async members(@Root() team: TeamNode): Promise<MembershipNode[]> {
    const memberships = await this.teamRepository.findMembersOfTeam({
      uuid: team.id,
    });

    return memberships.map((row) => membershipModelToResource(row));
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @FieldResolver(() => [MembershipNode], {
    deprecationReason: "Just query the members field and filter by role",
  })
  async captains(@Root() team: TeamNode): Promise<MembershipNode[]> {
    const memberships = await this.teamRepository.findMembersOfTeam(
      { uuid: team.id },
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
  async pointEntries(@Root() team: TeamNode): Promise<PointEntryNode[]> {
    const rows = await this.teamRepository.getTeamPointEntries({
      uuid: team.id,
    });

    return rows.map((row) => pointEntryModelToResource(row));
  }

  @AccessControl({ accessLevel: AccessLevel.Public })
  @FieldResolver(() => Int)
  async totalPoints(@Root() team: TeamNode): Promise<number> {
    const result = await this.teamRepository.getTotalTeamPoints({
      uuid: team.id,
    });

    return result._sum.points ?? 0;
  }

  @AccessControl({ accessLevel: AccessLevel.Public })
  @FieldResolver(() => Common.MarathonNode)
  async marathon(@Root() team: TeamNode): Promise<Common.MarathonNode> {
    const result = await this.teamRepository.getMarathon({ uuid: team.id });

    if (result == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
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
  @FieldResolver(() => ListFundraisingEntriesResponse)
  async fundraisingEntries(
    @Root() team: TeamNode,
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): Promise<ListFundraisingEntriesResponse> {
    const entries = await this.fundraisingEntryRepository.listEntries(
      {
        filters: args.filters,
        order:
          args.sortBy?.map((key, i) => [
            key,
            args.sortDirection?.[i] ?? SortDirection.desc,
          ]) ?? [],
        skip:
          args.page != null && args.pageSize != null
            ? (args.page - 1) * args.pageSize
            : null,
        take: args.pageSize,
      },
      {
        // EXTREMELY IMPORTANT FOR SECURITY
        forTeam: { uuid: team.id },
      }
    );
    const count = await this.fundraisingEntryRepository.countEntries({
      filters: args.filters,
    });

    if (entries.isErr) {
      throw new CatchableConcreteError(entries.error);
    }
    if (count.isErr) {
      throw new CatchableConcreteError(count.error);
    }

    return ListFundraisingEntriesResponse.newPaginated({
      data: await Promise.all(
        entries.value.map((model) => fundraisingEntryModelToNode(model))
      ),
      total: count.value,
      page: args.page,
      pageSize: args.pageSize,
    });
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

    if (rows.isErr) {
      throw new CatchableConcreteError(rows.error);
    }

    return rows.value.map((row) => {
      const teamInfoInstance = new DbFundsTeamInfo();
      teamInfoInstance.dbNum = row.dbNum;
      teamInfoInstance.name = row.name;
      return teamInfoInstance;
    });
  }
}
