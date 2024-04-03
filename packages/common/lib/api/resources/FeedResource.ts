import { Field, ID, ObjectType } from "type-graphql";

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

@ObjectType()
export class FeedResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  textContent?: string | null | undefined;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: {
    uuid: string;
    title: string;
    textContent?: string | null | undefined;
  }) {
    return FeedResource.doInit(init);
  }
}
