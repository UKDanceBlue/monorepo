import { URLResolver } from "graphql-scalars";
import { Field, ID, Int, ObjectType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";
@ObjectType({
  implements: [TimestampedResource, Node],
})
export class ImageResource extends TimestampedResource implements Node {
  @Field(() => ID)
  uuid!: string;

  @Field(() => URLResolver, { nullable: true })
  url!: URL | null;

  @Field(() => String)
  mimeType!: string;

  @Field(() => String, { nullable: true })
  thumbHash!: string | null;

  @Field(() => String, { nullable: true })
  alt!: string | null;

  @Field(() => Int)
  width!: number;

  @Field(() => Int)
  height!: number;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<ImageResource>) {
    return ImageResource.doInit(init);
  }
}

export const { ImageConnection, ImageEdge, ImageResult } = createNodeClasses(
  ImageResource,
  "Image"
);
