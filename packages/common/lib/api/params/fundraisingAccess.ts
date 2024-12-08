import { Field, InputType } from "type-graphql";

@InputType()
export class AssignEntryToPersonInput {
  @Field()
  amount!: number;
}

@InputType()
export class UpdateFundraisingAssignmentInput {
  @Field()
  amount!: number;
}
