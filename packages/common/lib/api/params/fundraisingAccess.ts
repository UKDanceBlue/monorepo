import { InputType, Field } from "type-graphql";
import { FundraisingAssignmentNode } from "../resources/Fundraising.js";
import {
  CommitteeIdentifier,
  CommitteeRole,
} from "../../authorization/structures.js";
import { AccessControlParam } from "../../authorization/accessControl.js";

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
