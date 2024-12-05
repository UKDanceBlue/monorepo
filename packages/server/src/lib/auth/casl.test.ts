import { TeamType } from "@prisma/client";
import {
  AccessLevel,
  MembershipPositionType,
  PersonNode,
} from "@ukdanceblue/common";
import { describe } from "vitest";

import { Action, getAuthorizationFor } from "./casl.js";
describe("getAuthorizationFor", (test) => {
  test("matches expected behavior for a team captain", ({ expect }) => {
    const ability = getAuthorizationFor({
      accessLevel: AccessLevel.UKY,
      authenticatedUser: PersonNode.init({
        id: "personId",
        email: "email@mail.com",
      }),
      teamMemberships: [
        {
          position: MembershipPositionType.Captain,
          teamId: "captainTeamId",
          teamType: TeamType.Spirit,
        },
        {
          position: MembershipPositionType.Member,
          teamId: "memberTeamId",
          teamType: TeamType.Spirit,
        },
      ],
      effectiveCommitteeRoles: [],
    });

    expect(
      ability.can(Action.Read, {
        kind: "PersonNode",
        id: "personId",
      })
    ).toBe(true);

    expect(
      ability.can(Action.Read, {
        kind: "PersonNode",
        id: "otherPersonId",
      })
    ).toBe(false);

    expect(
      ability.can(Action.Read, {
        kind: "TeamNode",
        id: "captainTeamId",
      })
    ).toBe(true);

    expect(
      ability.can(Action.Modify, {
        kind: "FundraisingAssignmentNode",
        id: "someId",
        withinTeamIds: ["captainTeamId"],
      })
    ).toBe(true);

    expect(
      ability.can(Action.Read, {
        kind: "FundraisingAssignmentNode",
        id: "someId",
        withinTeamIds: ["memberTeamId"],
      })
    ).toBe(false);

    expect(
      ability.can(Action.Modify, {
        kind: "FundraisingAssignmentNode",
        id: "someOtherId",
        withinTeamIds: ["otherTeamId"],
      })
    ).toBe(false);

    expect(ability.can(Action.Read, "all")).toBe(false);
  });

  test("matches expected behavior for a super-admin", ({ expect }) => {
    const ability = getAuthorizationFor({
      accessLevel: AccessLevel.SuperAdmin,
      authenticatedUser: null,
      effectiveCommitteeRoles: [],
      teamMemberships: [],
    });

    expect(ability.can(Action.Manage, "all")).toBe(true);
  });
});
