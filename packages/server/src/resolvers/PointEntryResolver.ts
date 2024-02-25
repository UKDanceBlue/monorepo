import {
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  PersonResource,
  PointEntryResource,
  PointOpportunityResource,
  SortDirection,
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
import { Service } from "typedi";

import { personModelToResource } from "../repositories/person/personModelToResource.js";
import { PointEntryRepository } from "../repositories/pointEntry/PointEntryRepository.js";
import { pointEntryModelToResource } from "../repositories/pointEntry/pointEntryModelToResource.js";
import { pointOpportunityModelToResource } from "../repositories/pointOpportunity/pointOpportunityModelToResource.js";
import { teamModelToResource } from "../repositories/team/teamModelToResource.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

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
class DeletePointEntryResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class CreatePointEntryInput implements Partial<PointEntryResource> {
  @Field(() => String, { nullable: true })
  comment!: string | null;

  @Field(() => Number)
  points!: number;

  @Field(() => String, { nullable: true })
  personFromUuid!: string | null;

  @Field(() => String, { nullable: true })
  opportunityUuid!: string | null;

  @Field(() => String)
  teamUuid!: string;
}

@ArgsType()
class ListPointEntriesArgs extends FilteredListQueryArgs<
  "createdAt" | "updatedAt",
  never,
  never,
  never,
  "createdAt" | "updatedAt",
  never
>("PointEntryResolver", {
  all: ["createdAt", "updatedAt"],
  date: ["createdAt", "updatedAt"],
}) {}

@Resolver(() => PointEntryResource)
@Service()
export class PointEntryResolver {
  constructor(private readonly pointEntryRepository: PointEntryRepository) {}

  @Query(() => GetPointEntryByUuidResponse, { name: "pointEntry" })
  async getByUuid(
    @Arg("uuid") uuid: string
  ): Promise<GetPointEntryByUuidResponse> {
    const model = await this.pointEntryRepository.findPointEntryByUnique({
      uuid,
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointEntry not found");
    }

    return GetPointEntryByUuidResponse.newOk(pointEntryModelToResource(model));
  }

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
            query.sortDirection?.[i] ?? SortDirection.DESCENDING,
          ]) ?? [],
        skip:
          query.page != null && query.pageSize != null
            ? query.page * query.pageSize
            : null,
        take: query.pageSize,
      }),
      this.pointEntryRepository.countPointEntries({
        filters: query.filters,
      }),
    ]);

    return ListPointEntriesResponse.newPaginated({
      data: rows.map((row) => pointEntryModelToResource(row)),
      total,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => CreatePointEntryResponse, { name: "createPointEntry" })
  async create(
    @Arg("input") input: CreatePointEntryInput
  ): Promise<CreatePointEntryResponse> {
    const model = await this.pointEntryRepository.createPointEntry({
      points: input.points,
      comment: input.comment,
      personParam: input.personFromUuid
        ? { uuid: input.personFromUuid }
        : undefined,
      opportunityParam: input.opportunityUuid
        ? { uuid: input.opportunityUuid }
        : undefined,
      teamParam: { uuid: input.teamUuid },
    });

    return CreatePointEntryResponse.newOk(pointEntryModelToResource(model));
  }

  @Mutation(() => DeletePointEntryResponse, { name: "deletePointEntry" })
  async delete(@Arg("uuid") id: string): Promise<DeletePointEntryResponse> {
    await this.pointEntryRepository.deletePointEntry({ uuid: id });

    return DeletePointEntryResponse.newOk(true);
  }

  @FieldResolver(() => PersonResource, { nullable: true })
  async personFrom(
    @Root() pointEntry: PointEntryResource
  ): Promise<PersonResource | null> {
    const model = await this.pointEntryRepository.getPointEntryPersonFrom({
      uuid: pointEntry.uuid,
    });

    return model ? personModelToResource(model) : null;
  }

  @FieldResolver(() => TeamResource)
  async team(@Root() pointEntry: PointEntryResource): Promise<TeamResource> {
    const model = await this.pointEntryRepository.getPointEntryTeam({
      uuid: pointEntry.uuid,
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointEntry not found");
    }

    return teamModelToResource(model);
  }

  @FieldResolver(() => PointOpportunityResource, { nullable: true })
  async pointOpportunity(
    @Root() pointEntry: PointEntryResource
  ): Promise<PointOpportunityResource | null> {
    const model = await this.pointEntryRepository.getPointEntryOpportunity({
      uuid: pointEntry.uuid,
    });

    return model ? pointOpportunityModelToResource(model) : null;
  }
}
