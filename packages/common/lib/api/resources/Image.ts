import { URLResolver } from "graphql-scalars";
import { Field, Int, ObjectType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

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
    url?: URL | undefined | null;
    mimeType: string;
    thumbHash?: string | undefined | null;
    alt?: string | undefined | null;
    width: number;
    height: number;
    updatedAt?: Date | undefined | null;
    createdAt?: Date | undefined | null;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const { ImageConnection, ImageEdge, ImageResult } = createNodeClasses(
  ImageNode,
  "Image"
);
