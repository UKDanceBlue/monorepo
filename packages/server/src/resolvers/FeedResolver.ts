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
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

import { feedItemModelToResource } from "../repositories/feed/feedModelToResource.js";
import { FeedRepository } from "../repositories/feed/feedRepository.js";

@InputType()
export class CreateFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | null | undefined;
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
  constructor(private readonly feedRepository: FeedRepository) {}

  @Query(() => [FeedResource])
  async feed(): Promise<FeedResource[]> {
    const rows = await this.feedRepository.getCompleteFeed();
    return rows.map(feedItemModelToResource);
  }

  @Mutation(() => FeedResource)
  async createFeedItem(
    @Arg("input") input: CreateFeedInput
  ): Promise<FeedResource> {
    const feedItem = await this.feedRepository.createFeedItem({
      title: input.title,
      textContent: input.textContent,
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
    return this.feedRepository.getFeedItemImage({ uuid });
  }
}