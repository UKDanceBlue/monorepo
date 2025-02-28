import { Field, InputType } from "type-graphql";

@InputType()
export class AssignEntryToPersonInput {
  @Field(() => Number, { nullable: false })
  amount!: number;
}

@InputType()
export class UpdateFundraisingAssignmentInput {
  @Field(() => Number, { nullable: false })
  amount!: number;
}
