import { Field, ObjectType } from "type-graphql";

import { AuthSource } from "../../authorization/structures.js";
import { Resource } from "../resources/Resource.js";

@ObjectType()
export class AuthIdPairResource<
  AllowedSources extends AuthSource = AuthSource,
> extends Resource {
  @Field(() => AuthSource, { nullable: false })
  source!: AllowedSources;

  @Field(() => String, { nullable: false })
  value!: string;

  init(init: { source: AllowedSources; value: string }) {
    this.source = init.source;
    this.value = init.value;
  }
}
