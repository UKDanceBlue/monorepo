import type { GlobalId } from "@ukdanceblue/common";
import {
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  GlobalIdScalar,
  PersonNode,
  PointEntryNode,
  PointOpportunityNode,
  SortDirection,
  TeamNode,
} from "@ukdanceblue/common";
import { NotFoundError , ConcreteResult } from "@ukdanceblue/common/error";
import { Err } from "ts-results-es";
import {
  Arg,
  Args,
  ArgsType,
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

import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PointEntryRepository } from "#repositories/pointEntry/PointEntryRepository.js";
import { pointEntryModelToResource } from "#repositories/pointEntry/pointEntryModelToResource.js";
import { pointOpportunityModelToResource } from "#repositories/pointOpportunity/pointOpportunityModelToResource.js";
import { teamModelToResource } from "#repositories/team/teamModelToResource.js";
import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "#resolvers/ApiResponse.js";

@ObjectType("GetPointEntryByUuidResponse", {
  implements: AbstractGraphQLOkResponse<PointEntryNode>,
})
class GetPointEntryByUuidResponse extends AbstractGraphQLOkResponse<PointEntryNode> {
  @Field(() => PointEntryNode)
  data!: PointEntryNode;
}
@ObjectType("ListPointEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointEntryNode>,
})
class ListPointEntriesResponse extends AbstractGraphQLPaginatedResponse<PointEntryNode> {
  @Field(() => [PointEntryNode])
  data!: PointEntryNode[];
}
@ObjectType("CreatePointEntryResponse", {
  implements: AbstractGraphQLCreatedResponse<PointEntryNode>,
})
class CreatePointEntryResponse extends AbstractGraphQLCreatedResponse<PointEntryNode> {
  @Field(() => PointEntryNode)
  data!: PointEntryNode;
}
@ObjectType("DeletePointEntryResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePointEntryResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class CreatePointEntryInput implements Partial<PointEntryNode> {
  @Field(() => String, { nullable: true })
  comment!: string | null;

  @Field(() => Int)
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

@Resolver(() => PointEntryNode)
@Service()
export class PointEntryResolver {
  constructor(
    private readonly pointEntryRepository: PointEntryRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @Query(() => GetPointEntryByUuidResponse, { name: "pointEntry" })
  async getByUuid(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<GetPointEntryByUuidResponse> {
    const model = await this.pointEntryRepository.findPointEntryByUnique({
      uuid: id,
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
            query.sortDirection?.[i] ?? SortDirection.desc,
          ]) ?? [],
        skip:
          query.page != null && query.pageSize != null
            ? (query.page - 1) * query.pageSize
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
  async delete(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<DeletePointEntryResponse> {
    await this.pointEntryRepository.deletePointEntry({ uuid: id });

    return DeletePointEntryResponse.newOk(true);
  }

  @FieldResolver(() => PersonNode, { nullable: true })
  async personFrom(
    @Root() { id: { id } }: PointEntryNode
  ): Promise<ConcreteResult<PersonNode>> {
    const model = await this.pointEntryRepository.getPointEntryPersonFrom({
      uuid: id,
    });

    return model
      ? personModelToResource(model, this.personRepository).promise
      : Err(new NotFoundError({ what: "Person" }));
  }

  @FieldResolver(() => TeamNode)
  async team(@Root() { id: { id } }: PointEntryNode): Promise<TeamNode> {
    const model = await this.pointEntryRepository.getPointEntryTeam({
      uuid: id,
    });

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointEntry not found");
    }

    return teamModelToResource(model);
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
