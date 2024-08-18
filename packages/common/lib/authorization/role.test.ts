import { roleToAccessLevel } from "./role.js";

import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
} from "../index.js";

import { describe, expect, it } from "vitest";



// TODO test the committee hierarchy system (i.e. overall and vice roles vs other committees)

describe("roleToAccessLevel", () => {
  it("returns the correct access level for a given role normally", () => {
    const chairRole = {
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Chair,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    };
    expect(roleToAccessLevel(chairRole)).toBe(
      AccessLevel.CommitteeChairOrCoordinator
    );

    const coordinatorRole = {
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Coordinator,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    };
    expect(roleToAccessLevel(coordinatorRole)).toBe(
      AccessLevel.CommitteeChairOrCoordinator
    );

    const memberRole = {
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Member,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    };
    expect(roleToAccessLevel(memberRole)).toBe(AccessLevel.Committee);

    const teamMemberRole = {
      dbRole: DbRole.UKY,
    };
    expect(roleToAccessLevel(teamMemberRole)).toBe(AccessLevel.UKY);

    const publicRole = {
      dbRole: DbRole.Public,
    };
    expect(roleToAccessLevel(publicRole)).toBe(AccessLevel.Public);

    const noneRole = {
      dbRole: DbRole.None,
    };
    expect(roleToAccessLevel(noneRole)).toBe(AccessLevel.None);
  });

  it("grants any member of the tech committee admin access", () => {
    const chairRole = {
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Chair,
      committeeIdentifier: CommitteeIdentifier.techCommittee,
    };
    expect(roleToAccessLevel(chairRole)).toBe(AccessLevel.Admin);

    const coordinatorRole = {
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Coordinator,
      committeeIdentifier: CommitteeIdentifier.techCommittee,
    };
    expect(roleToAccessLevel(coordinatorRole)).toBe(AccessLevel.Admin);

    const memberRole = {
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Member,
      committeeIdentifier: CommitteeIdentifier.techCommittee,
    };
    expect(roleToAccessLevel(memberRole)).toBe(AccessLevel.Admin);
  });

  it("throws an error for an illegal role", () => {
    const illegalRole = {
      dbRole: "illegal" as DbRole,
    };
    expect(() => roleToAccessLevel(illegalRole)).toThrow(
      "Illegal DbRole: [Parsing of 'illegal' failed]"
    );
  });
});
