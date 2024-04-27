import {
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  MarathonHourNode,
  MarathonNode,
  SortDirection,
} from "@ukdanceblue/common";
import { DateTimeISOResolver, VoidResolver } from "graphql-scalars";
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

import { MarathonRepository } from "../repositories/marathon/MarathonRepository.js";
import { marathonModelToResource } from "../repositories/marathon/marathonModelToResource.js";
import { marathonHourModelToResource } from "../repositories/marathonHour/marathonHourModelToResource.js";

import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ObjectType("ListMarathonsResponse", {
  implements: AbstractGraphQLPaginatedResponse<MarathonNode[]>,
})
class ListMarathonsResponse extends AbstractGraphQLPaginatedResponse<MarathonNode> {
  @Field(() => [MarathonNode])
  data!: MarathonNode[];
}

@InputType()
class CreateMarathonInput {
  @Field()
  year!: string;

  @Field(() => DateTimeISOResolver)
  startDate!: string;

  @Field(() => DateTimeISOResolver)
  endDate!: string;
}

@InputType()
class SetMarathonInput {
  @Field(() => String)
  year!: string;

  @Field(() => DateTimeISOResolver)
  startDate!: string;

  @Field(() => DateTimeISOResolver)
  endDate!: string;
}

@ArgsType()
class ListMarathonsArgs extends FilteredListQueryArgs<
  "year" | "startDate" | "endDate" | "createdAt" | "updatedAt",
  never,
  "year",
  never,
  "startDate" | "endDate" | "createdAt" | "updatedAt",
  never
>("MarathonResolver", {
  all: ["year", "startDate", "endDate", "createdAt", "updatedAt"],
  oneOf: ["year"],
  date: ["startDate", "endDate", "createdAt", "updatedAt"],
}) {}

@Resolver(() => MarathonNode)
@Service()
export class MarathonResolver {
  constructor(private readonly marathonRepository: MarathonRepository) {}

  @Query(() => MarathonNode)
  async marathon(@Arg("uuid") uuid: string) {
    const marathon = await this.marathonRepository.findMarathonByUnique({
      uuid,
    });
    if (marathon == null) {
      throw new DetailedError(ErrorCode.NotFound, "Marathon not found");
    }
    return marathonModelToResource(marathon);
  }

  @Query(() => MarathonNode)
  async marathonForYear(@Arg("year") year: string) {
    const marathon = await this.marathonRepository.findMarathonByUnique({
      year,
    });
    if (marathon == null) {
      throw new DetailedError(ErrorCode.NotFound, "Marathon not found");
    }
    return marathonModelToResource(marathon);
  }

  @Query(() => ListMarathonsResponse)
  async marathons(@Args() args: ListMarathonsArgs) {
    const marathons = await this.marathonRepository.listMarathons({
      filters: args.filters,
      order:
        args.sortBy?.map((key, i) => [
          key,
          args.sortDirection?.[i] ?? SortDirection.DESCENDING,
        ]) ?? [],
      skip:
        args.page != null && args.pageSize != null
          ? (args.page - 1) * args.pageSize
          : null,
      take: args.pageSize,
    });
    const marathonCount = await this.marathonRepository.countMarathons({
      filters: args.filters,
    });
    return ListMarathonsResponse.newPaginated({
      data: marathons.map(marathonModelToResource),
      total: marathonCount,
      page: args.page,
      pageSize: args.pageSize,
    });
  }

  @Query(() => MarathonNode, { nullable: true })
  async currentMarathon() {
    const marathon = await this.marathonRepository.findCurrentMarathon();
    if (marathon == null) {
      return null;
    }
    return marathonModelToResource(marathon);
  }

  @Query(() => MarathonNode, { nullable: true })
  async nextMarathon() {
    const marathon = await this.marathonRepository.findNextMarathon();
    if (marathon == null) {
      return null;
    }
    return marathonModelToResource(marathon);
  }

  @Mutation(() => MarathonNode)
  async createMarathon(@Arg("input") input: CreateMarathonInput) {
    const marathon = await this.marathonRepository.createMarathon(input);
    return marathonModelToResource(marathon);
  }

  @Mutation(() => MarathonNode)
  async setMarathon(
    @Arg("uuid") uuid: string,
    @Arg("input") input: SetMarathonInput
  ) {
    const marathon = await this.marathonRepository.updateMarathon(
      { uuid },
      input
    );
    if (marathon == null) {
      throw new DetailedError(ErrorCode.NotFound, "Marathon not found");
    }
    return marathonModelToResource(marathon);
  }

  @Mutation(() => VoidResolver)
  async deleteMarathon(@Arg("uuid") uuid: string) {
    const marathon = await this.marathonRepository.deleteMarathon({ uuid });
    if (marathon == null) {
      throw new DetailedError(ErrorCode.NotFound, "Marathon not found");
    }
  }

  @FieldResolver(() => [MarathonHourNode])
  async hours(@Root() marathon: MarathonNode) {
    const rows = await this.marathonRepository.getMarathonHours({
      uuid: marathon.id,
    });
    return rows.map(marathonHourModelToResource);
  }
}
