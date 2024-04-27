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

import { membershipModelToResource } from "../repositories/membership/membershipModelToResource.js";
import { pointEntryModelToResource } from "../repositories/pointEntry/pointEntryModelToResource.js";
import { TeamRepository } from "../repositories/team/TeamRepository.js";
import { teamModelToResource } from "../repositories/team/teamModelToResource.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
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

  @Field(() => String)
  marathonYear!: Common.MarathonYearString;

  @Field(() => String, { nullable: true })
  persistentIdentifier!: string | null;
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
  marathonYear!: [MarathonYearString] | null;
}

@Resolver(() => TeamNode)
@Service()
export class TeamResolver {
  constructor(private teamRepository: TeamRepository) {}

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
            query.sortDirection?.[i] ?? SortDirection.DESCENDING,
          ]) ?? [],
        skip:
          query.page != null && query.pageSize != null
            ? (query.page - 1) * query.pageSize
            : null,
        take: query.pageSize,
        onlyDemo: ctx.userData.authSource === AuthSource.Demo,
        legacyStatus: query.legacyStatus,
        marathonYear: query.marathonYear,
        type: query.type,
      }),
      this.teamRepository.countTeams({
        filters: query.filters,
        onlyDemo: ctx.userData.authSource === AuthSource.Demo,
        legacyStatus: query.legacyStatus,
        marathonYear: query.marathonYear,
        type: query.type,
      }),
    ]);

    return ListTeamsResponse.newPaginated({
      data: rows.map((row) =>
        teamModelToResource({
          id: row.id,
          uuid: row.uuid,
          name: row.name,
          persistentIdentifier: row.persistentIdentifier,
          legacyStatus: row.legacyStatus,
          marathonYear: row.marathonYear,
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
    @Arg("input") input: CreateTeamInput
  ): Promise<CreateTeamResponse> {
    const row = await this.teamRepository.createTeam({
      name: input.name,
      type: input.type,
      legacyStatus: input.legacyStatus,
      marathonYear: input.marathonYear,
      persistentIdentifier: input.persistentIdentifier,
    });

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
        marathonYear: input.marathonYear ?? undefined,
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
          root: "uuid",
          extractor: ({ teamIds }) => teamIds,
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
          root: "uuid",
          extractor: ({ teamIds }) => teamIds,
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
}
