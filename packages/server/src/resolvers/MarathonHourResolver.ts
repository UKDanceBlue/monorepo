import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  GlobalIdScalar,
  ImageNode,
  MarathonHourNode,
} from "@ukdanceblue/common";
import {
  CreateMarathonHourInput,
  ListMarathonHoursArgs,
  ListMarathonHoursResponse,
  SetMarathonHourInput,
} from "@ukdanceblue/common";
import { NotFoundError } from "@ukdanceblue/common/error";
import { VoidResolver } from "graphql-scalars";
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import type { GraphQLContext } from "#auth/context.js";
import { FileManager } from "#files/FileManager.js";
import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";
import { marathonHourModelToResource } from "#repositories/marathonHour/marathonHourModelToResource.js";
import { MarathonHourRepository } from "#repositories/marathonHour/MarathonHourRepository.js";
import type { RepositoryResult } from "#repositories/shared.js";

@Resolver(() => MarathonHourNode)
@Service([MarathonHourRepository, FileManager])
export class MarathonHourResolver
  implements CrudResolver<MarathonHourNode, "marathonHour">
{
  constructor(
    private readonly marathonHourRepository: MarathonHourRepository,
    private readonly fileManager: FileManager
  ) {}

  @AccessControlAuthorized("get", ["getId", "MarathonHourNode", "id"])
  @Query(() => MarathonHourNode)
  async marathonHour(@Arg("id", () => GlobalIdScalar) { id }: GlobalId) {
    const marathonHour =
      await this.marathonHourRepository.findMarathonHourByUnique({
        uuid: id,
      });
    if (marathonHour == null) {
      throw new NotFoundError("MarathonHour");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized("readActive", ["every", "MarathonHourNode"])
  @Query(() => MarathonHourNode, { nullable: true })
  async currentMarathonHour() {
    const marathonHour =
      await this.marathonHourRepository.findCurrentMarathonHour();
    if (marathonHour == null) {
      return null;
    }
    return marathonHourModelToResource(marathonHour);
  }

  // TODO: Double check that this access is correct
  @AccessControlAuthorized("list", ["every", "MarathonHourNode"])
  @Query(() => ListMarathonHoursResponse)
  marathonHours(@Args() query: ListMarathonHoursArgs) {
    return this.marathonHourRepository
      .findAndCount({
        filters: query.filters,
        sortBy: query.sortBy,
        offset: query.offset,
        limit: query.limit,
        search: query.search,
      })
      .map(({ selectedRows, total }) => {
        return ListMarathonHoursResponse.newPaginated({
          data: selectedRows.map((row) => marathonHourModelToResource(row)),
          total,
        });
      });
  }

  @FieldResolver(() => [ImageNode])
  async mapImages(
    @Root() { id: { id } }: MarathonHourNode,
    @Ctx() { serverUrl }: GraphQLContext
  ): Promise<ImageNode[]> {
    const images =
      (await this.marathonHourRepository.getMaps({ uuid: id })) ?? [];

    return Promise.all(
      images.map((image) =>
        imageModelToResource(
          image,
          image.file,
          this.fileManager,
          serverUrl
        ).promise.then((result) => result.unwrap())
      )
    );
  }

  @AccessControlAuthorized("create", ["every", "MarathonHourNode"])
  @Mutation(() => MarathonHourNode)
  @WithAuditLogging()
  async createMarathonHour(
    @Arg("input") input: CreateMarathonHourInput,
    @Arg("marathonUuid", () => GlobalIdScalar) marathonUuid: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.createMarathonHour({
      durationInfo: input.durationInfo,
      title: input.title,
      details: input.details,
      marathon: { uuid: marathonUuid.id },
      shownStartingAt: input.shownStartingAt.toJSDate(),
    });
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized("update", ["getId", "MarathonHourNode", "id"])
  @Mutation(() => MarathonHourNode)
  @WithAuditLogging()
  async setMarathonHour(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: SetMarathonHourInput
  ) {
    const marathonHour = await this.marathonHourRepository.updateMarathonHour(
      { uuid: id },
      {
        details: input.details,
        durationInfo: input.durationInfo,
        title: input.title,
        shownStartingAt: input.shownStartingAt.toJSDate(),
      }
    );
    if (marathonHour == null) {
      throw new NotFoundError("MarathonHour");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized("delete", ["getId", "MarathonHourNode", "id"])
  @Mutation(() => MarathonHourNode)
  @WithAuditLogging()
  async deleteMarathonHour(@Arg("id", () => GlobalIdScalar) { id }: GlobalId) {
    const marathonHour = await this.marathonHourRepository.deleteMarathonHour({
      uuid: id,
    });
    if (marathonHour == null) {
      throw new NotFoundError("MarathonHour");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized("update", ["getId", "MarathonHourNode", "id"])
  @Mutation(() => MarathonHourNode)
  @WithAuditLogging()
  async addMap(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("imageUuid", () => GlobalIdScalar) imageUuid: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.addMap(
      { uuid: id },
      { uuid: imageUuid.id }
    );
    if (marathonHour == null) {
      throw new NotFoundError("MarathonHour");
    }
    return marathonHourModelToResource(marathonHour);
  }

  @AccessControlAuthorized("update", ["getId", "MarathonHourNode", "id"])
  @Mutation(() => VoidResolver)
  @WithAuditLogging()
  async removeMap(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("imageUuid", () => GlobalIdScalar) imageUuid: GlobalId
  ) {
    const marathonHour = await this.marathonHourRepository.removeMap(
      { uuid: id },
      { uuid: imageUuid.id }
    );
    if (marathonHour == null) {
      throw new NotFoundError("MarathonHour");
    }
  }
}
