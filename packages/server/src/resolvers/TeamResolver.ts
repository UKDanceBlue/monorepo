import { Op } from "@sequelize/core";
import type {
  AuthorizationRuleOrAccessLevel,
  MarathonYearString,
  OptionalToNullable,
} from "@ukdanceblue/common";
import * as Common from "@ukdanceblue/common";
import {
  AccessLevel,
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
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

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

@ObjectType("GetTeamByUuidResponse", {
  implements: AbstractGraphQLOkResponse<TeamResource>,
})
class GetTeamByUuidResponse extends AbstractGraphQLOkResponse<TeamResource> {
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
class DeleteTeamResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@InputType()
class CreateTeamInput implements OptionalToNullable<Partial<TeamResource>> {
  @Field(() => ID)
  uuid!: string;

  @Field(() => String)
  name!: string;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => TeamLegacyStatus)
  legacyStatus!: TeamLegacyStatus;

  @Field(() => String)
  marathonYear!: Common.MarathonYearString;

  @Field(() => String)
  visibility!: DbRole;

  @Field(() => String)
  persistentIdentifier!: string;
}

@ArgsType()
class ListTeamsArgs extends FilteredListQueryArgs("TeamResolver", {
  all: [
    "uuid",
    "name",
    "type",
    "legacyStatus",
    "visibility",
    "marathonYear",
    "totalPoints",
  ],
  string: ["name"],
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
  @Query(() => GetTeamByUuidResponse, { name: "team" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetTeamByUuidResponse> {
    const row = await TeamModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    return GetTeamByUuidResponse.newOk(row.toResource());
  }

  @Query(() => ListTeamsResponse, { name: "teams" })
  async list(
    @Args(() => ListTeamsArgs) query: ListTeamsArgs
  ): Promise<ListTeamsResponse> {
    const findOptions = query.toSequelizeFindOptions(
      {
        uuid: "uuid",
      },
      TeamModel
    );

    if (query.type != null) {
      findOptions.where.type = { [Op.in]: query.type };
    }
    if (query.legacyStatus != null) {
      findOptions.where.legacyStatus = { [Op.in]: query.legacyStatus };
    }
    if (query.visibility != null) {
      findOptions.where.visibility = { [Op.in]: query.visibility };
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
      committeeIdentifier: "dancer-relations-committee",
      minCommitteeRole: CommitteeRole.Coordinator,
    },
  ])
  @Mutation(() => CreateTeamResponse, { name: "createTeam" })
  async create(
    @Arg("input") input: CreateTeamInput
  ): Promise<CreateTeamResponse> {
    const row = await TeamModel.create({
      uuid: input.uuid,
      name: input.name,
      type: input.type,
      legacyStatus: input.legacyStatus,
      visibility: input.visibility,
      marathonYear: input.marathonYear,
      persistentIdentifier: input.persistentIdentifier,
    });

    return CreateTeamResponse.newCreated(row.toResource(), row.uuid);
  }

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

  @FieldResolver(() => [MembershipResource])
  async members(@Root() team: TeamResource): Promise<MembershipResource[]> {
    const model = await TeamModel.findByUuid(team.uuid, {
      attributes: ["id", "uuid"],
      include: [MembershipModel.withScope("withTeam")],
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    return model.memberships.map((row) => row.toResource());
  }

  @FieldResolver(() => [MembershipResource])
  async captains(@Root() team: TeamResource): Promise<MembershipResource[]> {
    const model = await TeamModel.findByUuid(team.uuid, {
      attributes: ["id", "uuid"],
      include: [MembershipModel.withScope("withTeam").withScope("captains")],
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    return model.memberships.map((row) => row.toResource());
  }

  @FieldResolver(() => [PointEntryResource])
  async pointEntries(
    @Root() team: TeamResource
  ): Promise<PointEntryResource[]> {
    const model = await TeamModel.findByUuid(team.uuid, {
      attributes: ["id", "uuid"],
    });

    if (!model) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    const pointEntries = await model.getPointEntries();

    return pointEntries.map((row) => row.toResource());
  }

  @FieldResolver(() => Number)
  async totalPoints(@Root() team: TeamResource): Promise<number> {
    const model = await TeamModel.findByUuid(team.uuid, {
      attributes: ["id", "uuid"],
    });

    if (!model) {
      throw new DetailedError(ErrorCode.NotFound, "Team not found");
    }

    const pointEntries = await model.getPointEntries();

    return pointEntries.reduce((acc, row) => acc + row.points, 0);
  }
}
