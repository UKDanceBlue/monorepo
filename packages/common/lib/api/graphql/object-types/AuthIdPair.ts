import { Field, ObjectType } from "type-graphql";

import { AuthSource } from "../../../auth/index.js";

import { Resource } from "./Resource.js";

@ObjectType()
export class AuthIdPairResource<
  AllowedSources extends AuthSource = AuthSource,
> extends Resource {
  @Field(() => AuthSource)
  source!: AllowedSources;

  @Field(() => String)
  value!: string;

  init(init: { source: AllowedSources; value: string }) {
    this.source = init.source;
    this.value = init.value;
  }
}
