
import { FileManager } from "#files/FileManager.js";
import { FeedRepository } from "#repositories/feed/FeedRepository.js";
import { feedItemModelToResource } from "#repositories/feed/feedModelToResource.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";

import {
  DetailedError,
  ErrorCode,
  FeedNode,
  ImageNode,
} from "@ukdanceblue/common";
import {
  Arg,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

@InputType()
export class CreateFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | null | undefined;
  @Field(() => String, { nullable: true })
  imageUuid?: string | null | undefined;
}

@InputType()
export class SetFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | null | undefined;
}

@Resolver(() => FeedNode)
@Service()
export class FeedResolver {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly fileManager: FileManager
  ) {}

  @Query(() => [FeedNode])
  async feed(
    @Arg("limit", () => Int, { defaultValue: 10, nullable: true })
    limit: number | null
  ): Promise<FeedNode[]> {
    const rows = await this.feedRepository.getCompleteFeed({ limit });
    return rows.map(feedItemModelToResource);
  }

  @Mutation(() => FeedNode)
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

  @Mutation(() => FeedNode)
  async attachImageToFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string,
    @Arg("imageUuid") imageUuid: string
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.attachImageToFeedItem(
      {
        uuid: feedItemUuid,
      },
      {
        uuid: imageUuid,
      }
    );
    if (feedItem == null) {
      throw new DetailedError(ErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @Mutation(() => FeedNode)
  async removeImageFromFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.removeImageFromFeedItem({
      uuid: feedItemUuid,
    });
    if (feedItem == null) {
      throw new DetailedError(ErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @Mutation(() => FeedNode)
  async setFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string,
    @Arg("input") input: SetFeedInput
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.updateFeedItem(
      { uuid: feedItemUuid },
      {
        title: input.title,
        textContent: input.textContent,
      }
    );
    if (feedItem == null) {
      throw new DetailedError(ErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @Mutation(() => Boolean)
  async deleteFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string
  ): Promise<boolean> {
    const feedItem = await this.feedRepository.deleteFeedItem({
      uuid: feedItemUuid,
    });
    return feedItem != null;
  }

  @FieldResolver(() => ImageNode, { nullable: true })
  async image(@Root() { id: { id } }: FeedNode) {
    const row = await this.feedRepository.getFeedItemImage({ uuid: id });
    if (row == null) {
      return null;
    }
    return imageModelToResource(row, row.file, this.fileManager);
  }
}
