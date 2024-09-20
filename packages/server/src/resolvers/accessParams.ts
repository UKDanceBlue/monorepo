import { CommitteeRole } from "@prisma/client";
import { AccessControlParam, CommitteeIdentifier } from "@ukdanceblue/common";

/**
 * Access control param for granting access to all fundraising entries.
 */

export const globalFundraisingAccessParam: AccessControlParam<unknown> = {
  authRules: [
    {
      minCommitteeRole: CommitteeRole.Coordinator,
      committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee],
    },
  ],
};
