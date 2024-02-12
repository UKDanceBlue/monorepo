import { describe, expect, it } from "vitest";

import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  RoleResource,
} from "../index.js";

import { roleToAccessLevel, roleToAuthorization } from "./role.js";

describe(roleToAccessLevel, () => {
  it("returns the correct access level for a given role normally", () => {
    const chairRole = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Chair,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    });
    expect(roleToAccessLevel(chairRole)).toBe(
      AccessLevel.CommitteeChairOrCoordinator
    );

    const coordinatorRole = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Coordinator,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    });
    expect(roleToAccessLevel(coordinatorRole)).toBe(
      AccessLevel.CommitteeChairOrCoordinator
    );

    const memberRole = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Member,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    });
    expect(roleToAccessLevel(memberRole)).toBe(AccessLevel.Committee);

    const teamCaptainRole = RoleResource.init({
      dbRole: DbRole.TeamCaptain,
    });
    expect(roleToAccessLevel(teamCaptainRole)).toBe(AccessLevel.TeamCaptain);

    const teamMemberRole = RoleResource.init({
      dbRole: DbRole.TeamMember,
    });
    expect(roleToAccessLevel(teamMemberRole)).toBe(AccessLevel.TeamMember);

    const publicRole = RoleResource.init({
      dbRole: DbRole.Public,
    });
    expect(roleToAccessLevel(publicRole)).toBe(AccessLevel.Public);

    const noneRole = RoleResource.init({
      dbRole: DbRole.None,
    });
    expect(roleToAccessLevel(noneRole)).toBe(AccessLevel.None);
  });

  it("grants any member of the tech committee admin access", () => {
    const chairRole = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Chair,
      committeeIdentifier: CommitteeIdentifier.techCommittee,
    });
    expect(roleToAccessLevel(chairRole)).toBe(AccessLevel.Admin);

    const coordinatorRole = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Coordinator,
      committeeIdentifier: CommitteeIdentifier.techCommittee,
    });
    expect(roleToAccessLevel(coordinatorRole)).toBe(AccessLevel.Admin);

    const memberRole = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Member,
      committeeIdentifier: CommitteeIdentifier.techCommittee,
    });
    expect(roleToAccessLevel(memberRole)).toBe(AccessLevel.Admin);
  });

  it("throws an error for an illegal role", () => {
    const illegalRole = RoleResource.init({
      dbRole: "illegal" as DbRole,
    });
    expect(() => roleToAccessLevel(illegalRole)).toThrow(
      "Illegal DbRole: [Parsing of 'illegal' failed]"
    );
  });
});

describe(roleToAuthorization, () => {
  it("converts a role to an authorization object", () => {
    const role = RoleResource.init({
      dbRole: DbRole.TeamMember,
    });
    expect(roleToAuthorization(role)).toEqual({
      dbRole: DbRole.TeamMember,
      accessLevel: AccessLevel.TeamMember,
    });
  });

  it("converts a role with a committee set to an authorization object", () => {
    const role = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Member,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    });
    expect(roleToAuthorization(role)).toEqual({
      dbRole: DbRole.Committee,
      accessLevel: AccessLevel.Committee,
      committeeRole: CommitteeRole.Member,
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
    });
  });

  it("throws an error if one of committee or committeeRole is set without the other", ({
    expect,
  }) => {
    const role = RoleResource.init({
      dbRole: DbRole.Committee,
      committeeRole: CommitteeRole.Chair,
    });
    expect(() => roleToAuthorization(role)).toThrowError(
      "Cannot have a committee role without a committee or vice versa"
    );
  });
});
