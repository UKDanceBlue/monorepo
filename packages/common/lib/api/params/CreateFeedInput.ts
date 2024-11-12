import { Field, InputType } from "type-graphql";

@InputType()
export class CreateFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | undefined | null | undefined;
  @Field(() => String, { nullable: true })
  imageUuid?: string | undefined | null | undefined;
}

@InputType()
export class SetFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | undefined | null | undefined;
}
