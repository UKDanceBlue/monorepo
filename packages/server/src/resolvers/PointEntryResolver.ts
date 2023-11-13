import {
  ErrorCode,
  PersonResource,
  PointEntryResource,
  TeamResource,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { PersonModel } from "../models/Person.js";
import { PointEntryModel } from "../models/PointEntry.js";

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

@ObjectType("GetPointEntryByUuidResponse", {
  implements: AbstractGraphQLOkResponse<PointEntryResource>,
})
class GetPointEntryByUuidResponse extends AbstractGraphQLOkResponse<PointEntryResource> {
  @Field(() => PointEntryResource)
  data!: PointEntryResource;
}
@ObjectType("ListPointEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointEntryResource>,
})
class ListPointEntriesResponse extends AbstractGraphQLPaginatedResponse<PointEntryResource> {
  @Field(() => [PointEntryResource])
  data!: PointEntryResource[];
}
@ObjectType("CreatePointEntryResponse", {
  implements: AbstractGraphQLCreatedResponse<PointEntryResource>,
})
class CreatePointEntryResponse extends AbstractGraphQLCreatedResponse<PointEntryResource> {
  @Field(() => PointEntryResource)
  data!: PointEntryResource;
}
@ObjectType("DeletePointEntryResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePointEntryResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@InputType()
class CreatePointEntryInput implements Partial<PointEntryResource> {
  @Field(() => String, { nullable: true })
  comment!: string | null;

  @Field(() => Number)
  points!: number;

  @Field(() => String, { nullable: true })
  personFromUuid!: string | null;

  @Field(() => String)
  teamUuid!: string;
}

@ArgsType()
class ListPointEntriesArgs extends FilteredListQueryArgs("PointEntryResolver", {
  all: ["pointEntryId", "expoPushToken", "lastLogin", "createdAt", "updatedAt"],
  string: ["pointEntryId", "expoPushToken"],
  date: ["lastLogin", "createdAt", "updatedAt"],
}) {}

@Resolver(() => PointEntryResource)
export class PointEntryResolver
  implements
    ResolverInterface<PointEntryResource>,
    ResolverInterfaceWithFilteredList<PointEntryResource, ListPointEntriesArgs>
{
  @Query(() => GetPointEntryByUuidResponse, { name: "pointEntry" })
  async getByUuid(
    @Arg("uuid") uuid: string
  ): Promise<GetPointEntryByUuidResponse> {
    const row = await PointEntryModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointEntry not found");
    }

    return GetPointEntryByUuidResponse.newOk(row.toResource());
  }

  @Query(() => ListPointEntriesResponse, { name: "pointEntries" })
  async list(
    @Args(() => ListPointEntriesArgs) query: ListPointEntriesArgs
  ): Promise<ListPointEntriesResponse> {
    const findOptions = query.toSequelizeFindOptions(
      {
        pointEntryId: "pointEntryId",
        expoPushToken: "expoPushToken",
        lastLogin: "lastLogin",
      },
      PointEntryModel
    );

    const { rows, count } = await PointEntryModel.findAndCountAll(findOptions);

    return ListPointEntriesResponse.newPaginated({
      data: rows.map((row) => row.toResource()),
      total: count,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => CreatePointEntryResponse, { name: "createPointEntry" })
  async create(
    @Arg("input") input: CreatePointEntryInput
  ): Promise<CreatePointEntryResponse> {
    let personFromId;
    if (input.personFromUuid != null) {
      const personFrom = await PersonModel.findOne({
        where: { uuid: input.personFromUuid },
        attributes: ["id"],
      });
      personFromId = personFrom?.id;
    }

    const team = await PersonModel.findOne({
      where: { uuid: input.teamUuid },
    });

    const row = await PointEntryModel.create({
      comment: input.comment,
      points: input.points,
      personFromId,
      teamId: team?.id,
    });

    return CreatePointEntryResponse.newOk(row.toResource());
  }

  @Mutation(() => DeletePointEntryResponse, { name: "deletePointEntry" })
  async delete(@Arg("uuid") id: string): Promise<DeletePointEntryResponse> {
    const row = await PointEntryModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointEntry not found");
    }

    await row.destroy();

    return DeletePointEntryResponse.newOk(true);
  }

  @FieldResolver(() => PersonResource, { nullable: true })
  async personFrom(
    @Root() pointEntry: PointEntryResource
  ): Promise<PersonResource | null> {
    const model = await PointEntryModel.findByUuid(pointEntry.uuid, {
      include: { model: PersonModel, as: "personFrom" },
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointEntry not found");
    }

    return model.personFrom?.toResource() ?? null;
  }

  @FieldResolver(() => TeamResource)
  async team(@Root() pointEntry: PointEntryResource): Promise<TeamResource> {
    const model = await PointEntryModel.findByUuid(pointEntry.uuid, {
      include: { model: PersonModel, as: "team" },
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointEntry not found");
    }

    return model.team.toResource();
  }
}
