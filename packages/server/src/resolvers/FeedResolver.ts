import {
  DetailedError,
  ErrorCode,
  FeedResource,
  ImageResource,
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

import { FileManager } from "../lib/files/FileManager.js";
import { feedItemModelToResource } from "../repositories/feed/feedModelToResource.js";
import { FeedRepository } from "../repositories/feed/feedRepository.js";
import { imageModelToResource } from "../repositories/image/imageModelToResource.js";

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

@Resolver(() => FeedResource)
@Service()
export class FeedResolver {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly fileManager: FileManager
  ) {}

  @Query(() => [FeedResource])
  async feed(
    @Arg("limit", () => Int, { defaultValue: 10, nullable: true })
    limit: number | null
  ): Promise<FeedResource[]> {
    const rows = await this.feedRepository.getCompleteFeed({ limit });
    return rows.map(feedItemModelToResource);
  }

  @Mutation(() => FeedResource)
  async createFeedItem(
    @Arg("input") input: CreateFeedInput
  ): Promise<FeedResource> {
    const feedItem = await this.feedRepository.createFeedItem({
      title: input.title,
      textContent: input.textContent,
      imageUuid: input.imageUuid,
    });
    return feedItemModelToResource(feedItem);
  }

  @Mutation(() => FeedResource)
  async attachImageToFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string,
    @Arg("imageUuid") imageUuid: string
  ): Promise<FeedResource> {
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

  @Mutation(() => FeedResource)
  async removeImageFromFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string
  ): Promise<FeedResource> {
    const feedItem = await this.feedRepository.removeImageFromFeedItem({
      uuid: feedItemUuid,
    });
    if (feedItem == null) {
      throw new DetailedError(ErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @Mutation(() => FeedResource)
  async setFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string,
    @Arg("input") input: SetFeedInput
  ): Promise<FeedResource> {
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

  @FieldResolver(() => ImageResource, { nullable: true })
  async image(@Root() { uuid }: FeedResource) {
    const row = await this.feedRepository.getFeedItemImage({ uuid });
    if (row == null) {
      return null;
    }
    return imageModelToResource(row, row.file, this.fileManager);
  }
}
