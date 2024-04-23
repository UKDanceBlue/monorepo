import { Field, ID, ObjectType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";

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

@ObjectType({
  implements: [Node],
})
export class FeedNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  textContent?: string | null | undefined;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: {
    uuid: string;
    title: string;
    textContent?: string | null | undefined;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return FeedNode.doInit(init);
  }
}

export const { FeedConnection, FeedEdge, FeedResult } = createNodeClasses(
  FeedNode,
  "Feed"
);
