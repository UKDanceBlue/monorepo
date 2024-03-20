import {
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  ImageResource,
  MarathonHourResource,
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

import { MarathonHourRepository } from "../repositories/marathonHour/MarathonHourRepository.js";
import { marathonHourModelToResource } from "../repositories/marathonHour/marathonHourModelToResource.js";

import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ObjectType("ListMarathonHoursResponse", {
  implements: AbstractGraphQLPaginatedResponse<MarathonHourResource[]>,
})
class ListMarathonHoursResponse extends AbstractGraphQLPaginatedResponse<MarathonHourResource> {
  @Field(() => [MarathonHourResource])
  data!: MarathonHourResource[];
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

@Resolver(() => MarathonHourResource)
@Service()
export class MarathonHourResolver {
  constructor(
    private readonly marathonHourRepository: MarathonHourRepository
  ) {}

  @Query(() => MarathonHourResource)
  async marathonHour(@Arg("uuid") uuid: string) {
    const marathonHour =
      await this.marathonHourRepository.findMarathonHourByUnique({
        uuid,
      });
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
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

  @FieldResolver(() => [ImageResource])
  async mapImages(@Root() marathonHour: MarathonHourResource) {
    return this.marathonHourRepository.getMaps({ uuid: marathonHour.uuid });
  }

  @Mutation(() => MarathonHourResource)
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

  @Mutation(() => MarathonHourResource)
  async setMarathonHour(
    @Arg("uuid") uuid: string,
    @Arg("input") input: SetMarathonHourInput
  ) {
    const marathonHour = await this.marathonHourRepository.updateMarathonHour(
      { uuid },
      input
    );
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @Mutation(() => VoidResolver)
  async deleteMarathonHour(@Arg("uuid") uuid: string) {
    const marathonHour = await this.marathonHourRepository.deleteMarathonHour({
      uuid,
    });
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
  }

  @Mutation(() => MarathonHourResource)
  async addMap(@Arg("uuid") uuid: string, @Arg("imageUuid") imageUuid: string) {
    const marathonHour = await this.marathonHourRepository.addMap(
      { uuid },
      { uuid: imageUuid }
    );
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @Mutation(() => VoidResolver)
  async removeMap(
    @Arg("uuid") uuid: string,
    @Arg("imageUuid") imageUuid: string
  ) {
    const marathonHour = await this.marathonHourRepository.removeMap(
      { uuid },
      { uuid: imageUuid }
    );
    if (marathonHour == null) {
      throw new DetailedError(ErrorCode.NotFound, "MarathonHour not found");
    }
  }
}
