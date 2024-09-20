import {
  AccessControlParam,
  FundraisingAssignmentNode,
  CommitteeRole,
  CommitteeIdentifier,
} from "@ukdanceblue/common";
import { InputType, Field } from "type-graphql";

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
export const fundraisingAccess: AccessControlParam<FundraisingAssignmentNode> =
  {
    authRules: [
      {
        minCommitteeRole: CommitteeRole.Coordinator,
        committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee],
      },
    ],
  };
