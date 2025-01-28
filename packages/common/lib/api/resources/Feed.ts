import { GraphQLURL } from "graphql-scalars";
import { DateTime } from "luxon";
import { Field, InterfaceType, ObjectType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { ImageNode } from "./Image.js";
import { TimestampedResource } from "./Resource.js";

// TODO: Expand this to include more types of feed items
// export const FeedResourceType = {
//   FeaturedImage: "FeaturedImage",
// } as const;
// export type FeedItemType = (typeof FeedResourceType)[keyof typeof FeedResourceType];

// registerEnumType(FeedResourceType, {
//   name: "FeedResourceType",
//   description: "Dictates how to interpret the resource link",
// });

@InterfaceType()
export class FeedItem {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  textContent?: string | undefined | null;

  @Field(() => ImageNode, { nullable: true })
  image?: ImageNode | undefined | null;

  @Field(() => GraphQLURL, { nullable: true })
  link?: URL | undefined | null;

  @Field(() => DateTimeScalar, { nullable: true })
  createdAt!: DateTime;
}

@ObjectType({
  implements: [Node, FeedItem],
})
export class InstagramFeedNode
  extends TimestampedResource
  implements Node, FeedItem
{
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  textContent?: string | undefined | null;

  @Field(() => ImageNode, { nullable: true })
  image?: ImageNode | undefined | null;

  @Field(() => GraphQLURL, { nullable: true })
  link?: URL | undefined | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  @Field(() => String)
  text(): string {
    return this.title;
  }

  public static init(init: {
    id: string;
    title: string;
    textContent?: string | undefined | null;
    image?: ImageNode | undefined | null;
    link?: URL | undefined | null;
    createdAt?: DateTime;
    updatedAt?: DateTime;
  }) {
    return InstagramFeedNode.createInstance().withValues(init);
  }
}

@ObjectType({
  implements: [Node, FeedItem],
})
export class FeedNode extends TimestampedResource implements Node, FeedItem {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  textContent?: string | undefined | null;

  public getUniqueId(): string {
    return this.id.id;
  }

  @Field(() => String)
  text(): string {
    return this.title;
  }

  public static init(init: {
    id: string;
    title: string;
    textContent?: string | undefined | null;
    createdAt?: DateTime;
    updatedAt?: DateTime;
  }) {
    return FeedNode.createInstance().withValues(init);
  }
}

export const { FeedConnection, FeedEdge, FeedResult } = createNodeClasses(
  FeedNode,
  "Feed"
);
