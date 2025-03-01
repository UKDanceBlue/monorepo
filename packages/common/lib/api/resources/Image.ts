import { GraphQLURL } from "graphql-scalars";
import { DateTime } from "luxon";
import { Field, Int, ObjectType } from "type-graphql";

import { Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class ImageNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => GraphQLURL, { nullable: true })
  url!: URL | null;

  @Field(() => String, { nullable: false })
  mimeType!: string;

  @Field(() => String, { nullable: true })
  thumbHash!: string | null;

  @Field(() => String, { nullable: true })
  alt!: string | null;

  @Field(() => Int, { nullable: false })
  width!: number;

  @Field(() => Int, { nullable: false })
  height!: number;

  public getUniqueId(): string {
    return this.id.id;
  }

  @Field(() => String, { nullable: false })
  text(): string {
    return this.alt || this.url?.toString() || this.id.id;
  }

  public static init(init: {
    id: string;
    url?: URL | undefined | null;
    mimeType: string;
    thumbHash?: string | undefined | null;
    alt?: string | undefined | null;
    width: number;
    height: number;
    updatedAt?: DateTime | undefined | null;
    createdAt?: DateTime | undefined | null;
  }) {
    return this.createInstance().withValues(init);
  }
}
