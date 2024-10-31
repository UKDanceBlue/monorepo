import { CommitteeRole } from "@prisma/client";
import type { AccessControlParam} from "@ukdanceblue/common";
import { CommitteeIdentifier } from "@ukdanceblue/common";

/**
 * Access control param for granting access to all fundraising entries.
 *
 * Equates to any coord or chair on fundraising
 */
export const globalFundraisingAccessParam: AccessControlParam<unknown> = {
  authRules: [
    {
      minCommitteeRole: CommitteeRole.Coordinator,
      committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee],
    },
  ],
};
