import { randomUUID } from "node:crypto";

import { describe } from "vitest";

import { MembershipPositionType } from "../api/resources/Membership.js";
import { TeamType } from "../api/resources/Team.js";
import { type CaslParam, getAuthorizationFor } from "./accessControl.js";
import { AccessLevel } from "./structures.js";

describe("Person authorization", (test) => {
  const userId = randomUUID();
  const context: CaslParam = {
    accessLevel: AccessLevel.UKY,
    effectiveCommitteeRoles: [],
    teamMemberships: [],
    userId,
  };
  const ability = getAuthorizationFor(context);
  const self = {
    kind: "PersonNode",
    id: userId,
  } as const;
  const other = {
    kind: "PersonNode",
    id: randomUUID(),
  } as const;

  test("has correct permissions for self", ({ expect }) => {
    expect(ability.can("read", self)).toBe(true);
    expect(ability.can("update", self)).toBe(false);
    expect(ability.can("read", other)).toBe(false);
  });

  test("has correct permissions for own team memberships", ({ expect }) => {
    expect(ability.can("read", self, ".memberships")).toBe(true);
    expect(ability.can("update", self, ".memberships")).toBe(false);
    expect(ability.can("read", other, ".memberships")).toBe(false);
  });

  test("has correct permissions for own fundraising assignments", ({
    expect,
  }) => {
    expect(ability.can("read", self, ".fundraisingAssignments")).toBe(true);
    expect(ability.can("update", self, ".fundraisingAssignments")).toBe(false);
    expect(ability.can("read", other, ".fundraisingAssignments")).toBe(false);
  });
});

const team1 = {
  kind: "TeamNode",
  id: randomUUID(),
} as const;
const team2 = {
  kind: "TeamNode",
  id: randomUUID(),
} as const;
const team3 = {
  kind: "TeamNode",
  id: randomUUID(),
} as const;

describe("Team authorization for team member", (test) => {
  const userId = randomUUID();
  const context: CaslParam = {
    accessLevel: AccessLevel.UKY,
    effectiveCommitteeRoles: [],
    teamMemberships: [
      {
        position: MembershipPositionType.Member,
        teamType: TeamType.Spirit,
        teamId: team1.id,
      },
    ],
    userId,
  };
  const ability = getAuthorizationFor(context);

  test("has correct permissions for team", ({ expect }) => {
    expect(ability.can("read", team1)).toBe(true);
    expect(ability.can("read", team2)).toBe(true);
    expect(ability.can("update", team1)).toBe(false);
  });

  test("has correct permissions for team members", ({ expect }) => {
    expect(ability.can("read", team1, ".members")).toBe(true);
    expect(ability.can("update", team1, ".members")).toBe(false);
    expect(ability.can("read", team2, ".members")).toBe(false);
  });

  test("has correct permissions for team fundraising assignments", ({
    expect,
  }) => {
    expect(ability.can("read", team1, ".fundraisingAssignments")).toBe(false);
    expect(ability.can("read", team2, ".fundraisingAssignments")).toBe(false);
  });

  test("has correct permissions for team solicitation code", ({ expect }) => {
    expect(ability.can("read", team1, ".solicitationCode")).toBe(false);
    expect(ability.can("read", team2, ".solicitationCode")).toBe(false);
    expect(ability.can("update", team1, ".solicitationCode")).toBe(false);
  });

  test("has correct permissions for team fundraising total", ({ expect }) => {
    expect(ability.can("read", team1, ".fundraisingTotal")).toBe(true);
    expect(ability.can("read", team2, ".fundraisingTotal")).toBe(false);
  });
});

describe("Team authorization for team captain", (test) => {
  const userId = randomUUID();
  const context: CaslParam = {
    accessLevel: AccessLevel.UKY,
    effectiveCommitteeRoles: [],
    teamMemberships: [
      {
        position: MembershipPositionType.Captain,
        teamType: TeamType.Spirit,
        teamId: team1.id,
      },
      {
        position: MembershipPositionType.Member,
        teamType: TeamType.Spirit,
        teamId: team2.id,
      },
    ],
    userId,
  };
  const ability = getAuthorizationFor(context);

  test("has correct permissions for team", ({ expect }) => {
    expect(ability.can("read", team1)).toBe(true);
    expect(ability.can("read", team2)).toBe(true);
    expect(ability.can("read", team3)).toBe(true);
  });

  test("has correct permissions for team members", ({ expect }) => {
    expect(ability.can("read", team1, ".members")).toBe(true);
    expect(ability.can("update", team1, ".members")).toBe(false);
    expect(ability.can("read", team2, ".members")).toBe(true);
    expect(ability.can("read", team3, ".members")).toBe(false);
  });

  test("has correct permissions for team fundraising assignments", ({
    expect,
  }) => {
    expect(ability.can("modify", team1, ".fundraisingAssignments")).toBe(true);
    expect(ability.can("modify", team2, ".fundraisingAssignments")).toBe(false);
    expect(ability.can("modify", team3, ".fundraisingAssignments")).toBe(false);
  });

  test("has correct permissions for team solicitation code", ({ expect }) => {
    expect(ability.can("read", team1, ".solicitationCode")).toBe(true);
    expect(ability.can("update", team1, ".solicitationCode")).toBe(false);
    expect(ability.can("read", team2, ".solicitationCode")).toBe(false);
    expect(ability.can("read", team3, ".solicitationCode")).toBe(false);
  });

  test("has correct permissions for team fundraising total", ({ expect }) => {
    expect(ability.can("read", team1, ".fundraisingTotal")).toBe(true);
    expect(ability.can("read", team2, ".fundraisingTotal")).toBe(true);
    expect(ability.can("read", team3, ".fundraisingTotal")).toBe(false);
  });
});
