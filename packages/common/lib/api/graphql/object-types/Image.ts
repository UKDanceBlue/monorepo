import { Field, ID, Int, ObjectType } from "type-graphql";

import { UrlScalar } from "../custom-scalars/UrlScalar.js";

import { Resource } from "./Resource.js";

@ObjectType()
export class ImageResource extends Resource {
  @Field(() => ID)
  uuid!: string;

  @Field(() => UrlScalar, { nullable: true })
  url!: URL | null;

  @Field(() => String, { nullable: true })
  imageData!: string | null;

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
