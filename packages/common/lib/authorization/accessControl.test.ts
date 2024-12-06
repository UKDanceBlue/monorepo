import { randomUUID } from "node:crypto";

import { describe } from "vitest";

import { MembershipPositionType } from "../api/resources/Membership.js";
import { TeamType } from "../api/resources/Team.js";
import {  getAuthorizationFor, type CaslParam } from "./accessControl.js";
import { AccessLevel } from "./structures.js";

describe("Authorization for team member", (test) => {
  const committees = {
    Committee1: randomUUID(),
    Committee2: randomUUID(),
    Committee3: randomUUID(),
  };
  const userId = randomUUID();
  const context: CaslParam = {
    accessLevel: AccessLevel.UKY,
    effectiveCommitteeRoles: [],
    teamMemberships: [
      {
        position: MembershipPositionType.Member,
        teamType: TeamType.Spirit,
        teamId: committees.Committee1,
      },
      {
        position: MembershipPositionType.Member,
        teamType: TeamType.Spirit,
        teamId: committees.Committee2,
      },
    ],
    userId
  };
  const ability = getAuthorizationFor(context);

  test("can read team members", () => {
    expect(ability.can("read",
  });
});
