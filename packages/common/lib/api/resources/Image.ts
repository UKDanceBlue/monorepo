import { URLResolver } from "graphql-scalars";
import { Field, ID, Int, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class ImageResource extends TimestampedResource {
  @Field(() => ID)
  id!: string;

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
    return this.id;
  }

  public static init(init: Partial<ImageResource>) {
    return ImageResource.doInit(init);
  }
}
