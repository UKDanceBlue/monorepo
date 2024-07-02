import type { GlobalId } from "@ukdanceblue/common";
import {
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  GlobalIdScalar,
  ImageNode,
  MarathonHourNode,
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

import { MarathonHourRepository } from "#repositories/marathonHour/MarathonHourRepository.js";
import { marathonHourModelToResource } from "#repositories/marathonHour/marathonHourModelToResource.js";

import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ObjectType("ListMarathonHoursResponse", {
  implements: AbstractGraphQLPaginatedResponse<MarathonHourNode[]>,
})
class ListMarathonHoursResponse extends AbstractGraphQLPaginatedResponse<MarathonHourNode> {
  @Field(() => [MarathonHourNode])
  data!: MarathonHourNode[];
}

@InputType()
class CreateMarathonHourInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  details?: string | null;

  @Field(() => String)
  durationInfo!: string;

  @Field(() => DateTimeISOResolver)
  shownStartingAt!: string;
}

@InputType()
class SetMarathonHourInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  details?: string | null;

  @Field(() => String)
  durationInfo!: string;

  @Field(() => DateTimeISOResolver)
  shownStartingAt!: string;
}

@ArgsType()
class ListMarathonHoursArgs extends FilteredListQueryArgs<
  | "title"
  | "details"
  | "durationInfo"
  | "marathonYear"
  | "shownStartingAt"
  | "createdAt"
  | "updatedAt",
  "title" | "details" | "durationInfo",
  "marathonYear",
  never,
  "shownStartingAt" | "createdAt" | "updatedAt",
  never
>("MarathonHourResolver", {
  all: [
    "title",
    "details",
    "durationInfo",
    "marathonYear",
    "shownStartingAt",
    "createdAt",
    "updatedAt",
  ],
  string: ["title", "details", "durationInfo"],
  oneOf: ["marathonYear"],
  date: ["shownStartingAt", "createdAt", "updatedAt"],
}) {}

@Resolver(() => MarathonHourNode)
@Service()
export class MarathonHourResolver {
  constructor(
    private readonly marathonHourRepository: MarathonHourRepository
  ) {}

  @Query(() => MarathonHourNode)
  async marathonHour(@Arg("uuid", () => GlobalIdScalar) { id }: GlobalId) {
    const marathonHour =
      await this.marathonHourRepository.findMarathonHourByUnique({
        uuid: id,
      });
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @Query(() => MarathonHourNode, { nullable: true })
  async currentMarathonHour() {
    const marathonHour =
      await this.marathonHourRepository.findCurrentMarathonHour();
    if (marathonHour == null) {
      return null;
    }
    return marathonHourModelToResource(marathonHour);
  }

  @Query(() => ListMarathonHoursResponse)
  async marathons(@Args() args: ListMarathonHoursArgs) {
    const marathons = await this.marathonHourRepository.listMarathonHours(args);
    const marathonCount =
      await this.marathonHourRepository.countMarathonHours(args);
    return ListMarathonHoursResponse.newPaginated({
      data: marathons.map(marathonHourModelToResource),
      total: marathonCount,
      page: args.page,
      pageSize: args.pageSize,
    });
  }

  @FieldResolver(() => [ImageNode])
  async mapImages(@Root() { id: { id } }: MarathonHourNode) {
    return this.marathonHourRepository.getMaps({ uuid: id });
  }

  @Mutation(() => MarathonHourNode)
  async createMarathonHour(
    @Arg("input") input: CreateMarathonHourInput,
    @Arg("marathonUuid") marathonUuid: string
  ) {
    const marathonHour = await this.marathonHourRepository.createMarathonHour({
      ...input,
      marathon: { uuid: marathonUuid },
    });
    return marathonHourModelToResource(marathonHour);
  }

  @Mutation(() => MarathonHourNode)
  async setMarathonHour(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetMarathonHourInput
  ) {
    const marathonHour = await this.marathonHourRepository.updateMarathonHour(
      { uuid: id },
      input
    );
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @Mutation(() => VoidResolver)
  async deleteMarathonHour(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.deleteMarathonHour({
      uuid: id,
    });
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
  }

  @Mutation(() => MarathonHourNode)
  async addMap(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("imageUuid") imageUuid: string
  ) {
    const marathonHour = await this.marathonHourRepository.addMap(
      { uuid: id },
      { uuid: imageUuid }
    );
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @Mutation(() => VoidResolver)
  async removeMap(
    @Arg("uuid", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("imageUuid") imageUuid: string
  ) {
    const marathonHour = await this.marathonHourRepository.removeMap(
      { uuid: id },
      { uuid: imageUuid }
    );
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
  }
}
