import { Field, ObjectType } from "type-graphql";

import { ImageResource } from "./Image.js";
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
  @Field(() => String)
  title!: string;

  @Field(() => ImageResource, { nullable: true })
  image?: ImageResource;

  @Field(() => String, { nullable: true })
  textContent!: string;
}
