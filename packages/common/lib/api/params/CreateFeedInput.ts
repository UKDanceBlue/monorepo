import { Field,InputType } from "type-graphql";

@InputType()
export class CreateFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | null | undefined;
  @Field(() => String, { nullable: true })
  imageUuid?: string | null | undefined;
}

@InputType()
export class SetFeedInput {
  @Field(() => String)
  title!: string;
  @Field(() => String, { nullable: true })
  textContent?: string | null | undefined;
}
