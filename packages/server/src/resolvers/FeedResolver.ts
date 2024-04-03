import { FeedResource } from "@ukdanceblue/common";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";

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
  @Query(() => [FeedResource])
  async feed(): Promise<FeedResource[]> {
    return [];
  }

  @Mutation(() => FeedResource)
  async createFeedItem(
    @Arg("input") input: CreateFeedInput
  ): Promise<FeedResource> {
    return new FeedResource();
  }

  @Mutation(() => FeedResource)
  async attachImageToFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string,
    @Arg("imageUuid") imageUuid: string
  ): Promise<FeedResource> {
    return new FeedResource();
  }

  @Mutation(() => FeedResource)
  async removeImageFromFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string
  ): Promise<FeedResource> {
    return new FeedResource();
  }

  @Mutation(() => FeedResource)
  async setFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string,
    @Arg("input") input: SetFeedInput
  ): Promise<FeedResource> {
    return new FeedResource();
  }

  @Mutation(() => Boolean)
  async deleteFeedItem(
    @Arg("feedItemUuid") feedItemUuid: string
  ): Promise<boolean> {
    return true;
  }
}
