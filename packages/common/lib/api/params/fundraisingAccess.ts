import { Field,InputType } from "type-graphql";

import { AccessControlParam } from "../../authorization/accessControl.js";
import {
  CommitteeIdentifier,
  CommitteeRole,
} from "../../authorization/structures.js";
import { FundraisingAssignmentNode } from "../resources/Fundraising.js";

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
        committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee, CommitteeIdentifier.dancerRelationsCommittee],
      },
    ],
  };
