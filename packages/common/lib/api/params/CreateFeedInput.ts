import { NonEmptyStringResolver } from "graphql-scalars";
import { Field, InputType } from "type-graphql";

import { GlobalIdScalar } from "../scalars/GlobalId.js";

@InputType()
export class CreateFeedInput {
  @Field(() => NonEmptyStringResolver)
  title!: string;
  @Field(() => NonEmptyStringResolver, { nullable: true })
  textContent?: string | undefined | null;
  @Field(() => GlobalIdScalar, { nullable: true })
  imageUuid?: string | undefined | null;
}

@InputType()
export class SetFeedInput {
  @Field(() => NonEmptyStringResolver)
  title!: string;
  @Field(() => NonEmptyStringResolver, { nullable: true })
  textContent?: string | undefined | null;
}
