import { Service } from "@freshgum/typedi";
import {
  AccessControlAuthorized,
  assertGlobalId,
  FeedItem,
  FeedNode,
  type GlobalId,
  GlobalIdScalar,
  ImageNode,
  InstagramFeedNode,
  LegacyError,
  LegacyErrorCode,
} from "@ukdanceblue/common";
import { CreateFeedInput, SetFeedInput } from "@ukdanceblue/common";
import { ConcreteResult, NotFoundError } from "@ukdanceblue/common/error";
import { Err, Ok } from "ts-results-es";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { FileManager } from "#files/FileManager.js";
import { InsagramApi } from "#lib/external-apis/feed/instagramfeed.js";
import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { logger } from "#lib/logging/standardLogging.js";
import { feedItemModelToResource } from "#repositories/feed/feedModelToResource.js";
import { FeedRepository } from "#repositories/feed/FeedRepository.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";

import type { GraphQLContext } from "../lib/auth/context.js";

@Resolver(() => FeedNode)
@Service([FeedRepository, FileManager, InsagramApi])
export class FeedResolver {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly fileManager: FileManager,
    private readonly instagramApi: InsagramApi
  ) {}

  @Query(() => FeedNode, { description: "Get a feed item by its UUID" })
  @AccessControlAuthorized("get", ["getId", "FeedNode", "feedItemId"])
  async feedItem(
    @Arg("feedItemId", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<FeedNode>> {
    const feedItem = await this.feedRepository.getFeedItemByUnique({
      uuid: id,
    });
    if (feedItem == null) {
      return Err(new NotFoundError("Feed item not found"));
    }
    return Ok(feedItemModelToResource(feedItem));
  }

  @Query(() => [FeedItem], { description: "Get the active feed" })
  @AccessControlAuthorized("readActive", ["every", "FeedNode"])
  async feed(
    @Arg("limit", () => Int, { defaultValue: 10, nullable: true })
    limit: number
  ): Promise<ConcreteResult<FeedItem[]>> {
    const appFeed = await this.feedRepository.getCompleteFeed({ limit });

    const instagramFeedResult = await this.instagramApi.getFeed(limit).promise;
    let instagramFeed: InstagramFeedNode[];
    if (instagramFeedResult.isErr()) {
      logger.error(instagramFeedResult.error[0].toString());
      instagramFeed = instagramFeedResult.error[1] ?? [];
    } else {
      instagramFeed = instagramFeedResult.value;
    }

    const fullFeed = [
      ...appFeed.map(feedItemModelToResource),
      ...instagramFeed,
    ].sort(
      ({ createdAt: createdAtA }, { createdAt: createdAtB }) =>
        createdAtB.toMillis() - createdAtA.toMillis()
    );

    const mostRecentNItems: FeedItem[] = fullFeed.slice(0, limit);

    return Ok(mostRecentNItems);
  }

  @AccessControlAuthorized("create", ["every", "FeedNode"])
  @Mutation(() => FeedNode, { description: "Add a new item to the feed" })
  @WithAuditLogging()
  async createFeedItem(
    @Arg("input") input: CreateFeedInput
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.createFeedItem({
      title: input.title,
      textContent: input.textContent,
      imageUuid: input.imageUuid,
    });
    return feedItemModelToResource(feedItem);
  }

  @AccessControlAuthorized("update", ["getId", "FeedNode", "feedItemUuid"])
  @Mutation(() => FeedNode, { description: "Attach an image to a feed item" })
  async attachImageToFeedItem(
    @Arg("feedItemUuid", () => GlobalIdScalar) feedItemUuid: GlobalId,
    @Arg("imageUuid", () => GlobalIdScalar) imageUuid: GlobalId
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.attachImageToFeedItem(
      {
        uuid: feedItemUuid.id,
      },
      {
        uuid: imageUuid.id,
      }
    );
    if (feedItem == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @AccessControlAuthorized("update", ["getId", "FeedNode", "feedItemUuid"])
  @Mutation(() => FeedNode, { description: "Remove an image from a feed item" })
  async removeImageFromFeedItem(
    @Arg("feedItemUuid", () => GlobalIdScalar) feedItemUuid: GlobalId
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.removeImageFromFeedItem({
      uuid: feedItemUuid.id,
    });
    if (feedItem == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @AccessControlAuthorized("update", ["getId", "FeedNode", "feedItemUuid"])
  @Mutation(() => FeedNode, { description: "Set the content of a feed item" })
  async setFeedItem(
    @Arg("feedItemUuid", () => GlobalIdScalar) feedItemUuid: GlobalId,
    @Arg("input") input: SetFeedInput
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.updateFeedItem(
      { uuid: feedItemUuid.id },
      {
        title: input.title,
        textContent: input.textContent,
      }
    );
    if (feedItem == null) {
      throw new LegacyError(LegacyErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @AccessControlAuthorized(
    "delete",
    (_, { feedItemUuid }) =>
      assertGlobalId(feedItemUuid).map(({ id }) => ({ kind: "FeedNode", id })),
    "."
  )
  @Mutation(() => Boolean, { description: "Delete a feed item" })
  async deleteFeedItem(
    @Arg("feedItemUuid", () => GlobalIdScalar) feedItemUuid: GlobalId
  ): Promise<boolean> {
    const feedItem = await this.feedRepository.deleteFeedItem({
      uuid: feedItemUuid.id,
    });
    return feedItem != null;
  }

  @FieldResolver(() => ImageNode, {
    nullable: true,
    description: "The image associated with this feed item",
  })
  async image(
    @Root() { id: { id } }: FeedNode,
    @Ctx() { serverUrl }: GraphQLContext
  ) {
    const row = await this.feedRepository.getFeedItemImage({ uuid: id });
    if (row == null) {
      return null;
    }
    return imageModelToResource(row, row.file, this.fileManager, serverUrl);
  }
}
