import { MinLength } from "class-validator";
import { GraphQLNonEmptyString } from "graphql-scalars";
import { Field, InputType } from "type-graphql";

import { GlobalIdScalar } from "../scalars/GlobalId.js";

@InputType()
export class CreateFeedInput {
  @MinLength(5)
  @Field(() => GraphQLNonEmptyString, { nullable: false })
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  textContent?: string | undefined | null;

  @Field(() => GlobalIdScalar, { nullable: true })
  imageUuid?: string | undefined | null;
}

@InputType()
export class SetFeedInput {
  @MinLength(5)
  @Field(() => GraphQLNonEmptyString, { nullable: false })
  title!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  textContent?: string | undefined | null;
}
