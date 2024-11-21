import { Field, InputType } from "type-graphql";

@InputType()
export class CreateFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | undefined | null;
  @Field(() => String, { nullable: true })
  imageUuid?: string | undefined | null;
}

@InputType()
export class SetFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | undefined | null;
}
