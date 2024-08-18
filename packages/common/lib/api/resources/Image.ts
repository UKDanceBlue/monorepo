import { TimestampedResource } from "./Resource.js";

import { Node, createNodeClasses } from "../relay.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { URLResolver } from "graphql-scalars";
import { Field, Int, ObjectType } from "type-graphql";

import type { GlobalId } from "../scalars/GlobalId.js";


@ObjectType({
  implements: [Node],
})
export class ImageNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

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
    return this.id.id;
  }

  public static init(init: {
    id: string;
    url?: URL | null;
    mimeType: string;
    thumbHash?: string | null;
    alt?: string | null;
    width: number;
    height: number;
    updatedAt?: Date | null;
    createdAt?: Date | null;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const { ImageConnection, ImageEdge, ImageResult } = createNodeClasses(
  ImageNode,
  "Image"
);
