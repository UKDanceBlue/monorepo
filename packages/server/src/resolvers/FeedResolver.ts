import { FileManager } from "#files/FileManager.js";
import { FeedRepository } from "#repositories/feed/FeedRepository.js";
import { feedItemModelToResource } from "#repositories/feed/feedModelToResource.js";
import { imageModelToResource } from "#repositories/image/imageModelToResource.js";
import { CommitteeRole } from "@prisma/client";

import {
  AccessControl,
  AccessLevel,
  DetailedError,
  ErrorCode,
  FeedNode,
  type GlobalId,
  GlobalIdScalar,
  ImageNode,
} from "@ukdanceblue/common";
import { ConcreteResult, NotFoundError } from "@ukdanceblue/common/error";
import { Err, Ok } from "ts-results-es";
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
import { Service } from "@freshgum/typedi";

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

// TODO: Add access control

@Resolver(() => FeedNode)
@Service([FeedRepository, FileManager])
export class FeedResolver {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly fileManager: FileManager
  ) {}

  @Query(() => FeedNode)
  async feedItem(
    @Arg("feedItemId", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<FeedNode>> {
    const feedItem = await this.feedRepository.getFeedItemByUnique({
      uuid: id,
    });
    if (feedItem == null) {
      return Err(new NotFoundError({ what: "Feed item not found" }));
    }
    return Ok(feedItemModelToResource(feedItem));
  }

  @Query(() => [FeedNode])
  async feed(
    @Arg("limit", () => Int, { defaultValue: 10, nullable: true })
    limit: number | null
  ): Promise<FeedNode[]> {
    const rows = await this.feedRepository.getCompleteFeed({ limit });
    return rows.map(feedItemModelToResource);
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
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

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => FeedNode)
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
      throw new DetailedError(ErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => FeedNode)
  async removeImageFromFeedItem(
    @Arg("feedItemUuid", () => GlobalIdScalar) feedItemUuid: GlobalId
  ): Promise<FeedNode> {
    const feedItem = await this.feedRepository.removeImageFromFeedItem({
      uuid: feedItemUuid.id,
    });
    if (feedItem == null) {
      throw new DetailedError(ErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => FeedNode)
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
      throw new DetailedError(ErrorCode.NotFound, "Feed item not found");
    }
    return feedItemModelToResource(feedItem);
  }

  @AccessControl(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      authRules: [{ minCommitteeRole: CommitteeRole.Chair }],
    }
  )
  @Mutation(() => Boolean)
  async deleteFeedItem(
    @Arg("feedItemUuid", () => GlobalIdScalar) feedItemUuid: GlobalId
  ): Promise<boolean> {
    const feedItem = await this.feedRepository.deleteFeedItem({
      uuid: feedItemUuid.id,
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
