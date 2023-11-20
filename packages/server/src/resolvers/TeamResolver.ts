import { Op, QueryTypes, literal } from "@sequelize/core";
import type {
  AuthorizationRuleOrAccessLevel,
  MarathonYearString,
  OptionalToNullable,
} from "@ukdanceblue/common";
import * as Common from "@ukdanceblue/common";
import {
  AccessLevel,
  AccessLevelAuthorized,
  CommitteeRole,
  DbRole,
  ErrorCode,
  MembershipResource,
  PointEntryResource,
  TeamLegacyStatus,
  TeamResource,
  TeamType,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Authorized,
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

import { sequelizeDb } from "../data-source.js";
import { MembershipModel } from "../models/Membership.js";
import { TeamModel } from "../models/Team.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import type {
  ResolverInterface,
  ResolverInterfaceWithFilteredList,
} from "./ResolverInterface.js";
import { FilteredListQueryArgs } from "./list-query-args/FilteredListQueryArgs.js";

@ObjectType("SingleTeamResponse", {
  implements: AbstractGraphQLOkResponse<TeamResource>,
})
class SingleTeamResponse extends AbstractGraphQLOkResponse<TeamResource> {
  @Field(() => TeamResource)
  data!: TeamResource;
}
@ObjectType("ListTeamsResponse", {
  implements: AbstractGraphQLPaginatedResponse<TeamResource>,
})
class ListTeamsResponse extends AbstractGraphQLPaginatedResponse<TeamResource> {
  @Field(() => [TeamResource])
  data!: TeamResource[];
}
@ObjectType("CreateTeamResponse", {
  implements: AbstractGraphQLCreatedResponse<TeamResource>,
})
class CreateTeamResponse extends AbstractGraphQLCreatedResponse<TeamResource> {
  @Field(() => TeamResource)
  data!: TeamResource;
}
@ObjectType("DeleteTeamResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeleteTeamResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class CreateTeamInput implements OptionalToNullable<Partial<TeamResource>> {
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
class SetTeamInput implements OptionalToNullable<Partial<TeamResource>> {
  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => TeamLegacyStatus, { nullable: true })
  legacyStatus!: TeamLegacyStatus | null;

  @Field(() => String, { nullable: true })
  marathonYear!: Common.MarathonYearString | null;

  @Field(() => String, { nullable: true })
  persistentIdentifier!: string | null;
}

@ArgsType()
class ListTeamsArgs extends FilteredListQueryArgs("TeamResolver", {
  all: ["name", "type", "legacyStatus", "marathonYear", "totalPoints"],
  string: ["name", "type", "marathonYear", "legacyStatus"],
  numeric: ["totalPoints"],
}) {
  @Field(() => [TeamType], { nullable: true })
  type!: [TeamType] | null;

  @Field(() => [TeamLegacyStatus], { nullable: true })
  legacyStatus!: [TeamLegacyStatus] | null;

  @Field(() => [DbRole], { nullable: true })
  visibility!: [DbRole] | null;

  @Field(() => [String], { nullable: true })
  marathonYear!: [MarathonYearString] | null;
}

@Resolver(() => TeamResource)
export class TeamResolver
  implements
    ResolverInterface<TeamResource>,
    ResolverInterfaceWithFilteredList<TeamResource, ListTeamsArgs>
{
  @AccessLevelAuthorized(AccessLevel.Committee)
  @Query(() => SingleTeamResponse, { name: "team" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<SingleTeamResponse> {
    const row = await TeamModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    return SingleTeamResponse.newOk(row.toResource());
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
  @Query(() => ListTeamsResponse, { name: "teams" })
  async list(
    @Args(() => ListTeamsArgs) query: ListTeamsArgs
  ): Promise<ListTeamsResponse> {
    const findOptions = query.toSequelizeFindOptions(
      {
        name: "name",
        legacyStatus: "legacyStatus",
        marathonYear: "marathonYear",
        type: "type",
        totalPoints: literal(
          `(SELECT COALESCE(SUM(points), 0) AS totalPoints FROM danceblue.point_entries WHERE team_id = "Team"."id" AND deleted_at IS NULL)`
        ),
      },
      TeamModel
    );

    if (query.type != null) {
      findOptions.where.type = { [Op.in]: query.type };
    }
    if (query.legacyStatus != null) {
      findOptions.where.legacyStatus = { [Op.in]: query.legacyStatus };
    }
    if (query.marathonYear != null) {
      findOptions.where.marathonYear = { [Op.in]: query.marathonYear };
    }

    const { rows, count } = await TeamModel.findAndCountAll(findOptions);

    return ListTeamsResponse.newPaginated({
      data: rows.map((row) => row.toResource()),
      total: count,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Authorized<AuthorizationRuleOrAccessLevel>([
    AccessLevel.Admin,
    {
      committeeIdentifier:
        Common.CommitteeIdentifier["dancerRelationsCommittee"],
      minCommitteeRole: CommitteeRole.Coordinator,
    },
  ])
  @Mutation(() => CreateTeamResponse, { name: "createTeam" })
  async create(
    @Arg("input") input: CreateTeamInput
  ): Promise<CreateTeamResponse> {
    const row = await TeamModel.create({
      name: input.name,
      type: input.type,
      legacyStatus: input.legacyStatus,
      marathonYear: input.marathonYear,
      persistentIdentifier: input.persistentIdentifier,
    });

    return CreateTeamResponse.newCreated(row.toResource(), row.uuid);
  }

  @Authorized<AuthorizationRuleOrAccessLevel>([
    AccessLevel.Admin,
    {
      committeeIdentifier:
        Common.CommitteeIdentifier["dancerRelationsCommittee"],
      minCommitteeRole: CommitteeRole.Coordinator,
    },
  ])
  @Mutation(() => SingleTeamResponse, { name: "setTeam" })
  async set(
    @Arg("uuid") uuid: string,
    @Arg("input") input: SetTeamInput
  ): Promise<SingleTeamResponse> {
    const row = await TeamModel.findByUuid(uuid);

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    if (input.name != null) {
      row.name = input.name;
    }
    if (input.type != null) {
      row.type = input.type;
    }
    if (input.legacyStatus != null) {
      row.legacyStatus = input.legacyStatus;
    }
    if (input.marathonYear != null) {
      row.marathonYear = input.marathonYear;
    }
    if (input.persistentIdentifier != null) {
      row.persistentIdentifier = input.persistentIdentifier;
    }

    await row.save();

    return SingleTeamResponse.newOk(row.toResource());
  }

  @Authorized<AuthorizationRuleOrAccessLevel>([
    AccessLevel.Admin,
    {
      committeeIdentifier:
        Common.CommitteeIdentifier["dancerRelationsCommittee"],
      minCommitteeRole: CommitteeRole.Coordinator,
    },
  ])
  @Mutation(() => DeleteTeamResponse, { name: "deleteTeam" })
  async delete(@Arg("uuid") id: string): Promise<DeleteTeamResponse> {
    const row = await TeamModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    await row.destroy();

    return DeleteTeamResponse.newOk(true);
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
  @FieldResolver(() => [MembershipResource])
  async members(@Root() team: TeamResource): Promise<MembershipResource[]> {
    const model = await TeamModel.findByUuid(team.uuid, {
      attributes: ["id", "uuid"],
      include: [
        {
          model: MembershipModel,
          required: false,
        },
      ],
    });

    if (model == null) {
      throw new DetailedError(
        ErrorCode.NotFound,
        "Failed to load team for members"
      );
    }

    return model.memberships.map((row) => row.toResource());
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
  @FieldResolver(() => [MembershipResource])
  async captains(@Root() team: TeamResource): Promise<MembershipResource[]> {
    const model = await TeamModel.findByUuid(team.uuid, {
      attributes: ["id", "uuid"],
      include: [
        {
          model: MembershipModel.withScope("captains"),
          required: false,
        },
      ],
    });

    if (model == null) {
      throw new DetailedError(
        ErrorCode.NotFound,
        "Failed to load team for captains"
      );
    }

    return (model.memberships ?? []).map((row) => row.toResource());
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
  @FieldResolver(() => [PointEntryResource])
  async pointEntries(
    @Root() team: TeamResource
  ): Promise<PointEntryResource[]> {
    const model = await TeamModel.findByUuid(team.uuid, {
      attributes: ["id", "uuid"],
    });

    if (!model) {
      throw new DetailedError(
        ErrorCode.NotFound,
        "Failed to load team for point entries"
      );
    }

    const pointEntries = await model.getPointEntries();

    return pointEntries.map((row) => row.toResource());
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
  @FieldResolver(() => Int)
  async totalPoints(@Root() team: TeamResource): Promise<number> {
    const teamModel = await TeamModel.findByUuid(team.uuid, {});

    if (!teamModel) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    const val = await sequelizeDb.query(
      `SELECT COALESCE(SUM(points), 0) AS "totalPoints" FROM danceblue.point_entries WHERE team_id = ? AND deleted_at IS NULL`,
      {
        type: QueryTypes.SELECT,
        replacements: [teamModel.id],
      }
    );

    if (val.length === 0) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    if (val.length > 1) {
      throw new Error("More than one row returned");
    }

    const { totalPoints: totalPointsString } = val[0] as Record<
      string,
      unknown
    >;
    return typeof totalPointsString === "string"
      ? Number.parseInt(totalPointsString, 10)
      : Number(totalPointsString);
  }
}
