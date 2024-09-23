import { checkAuthorization } from "../../authorization/accessControl.js";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
} from "../../index.js";

import { describe, expect, it } from "vitest";

import type { Authorization } from "../../index.js";

const techChair: Authorization = {
  accessLevel: AccessLevel.Admin,
  dbRole: DbRole.Committee,
  effectiveCommitteeRoles: [
    {
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Chair,
    },
  ],
};

const techCoordinator: Authorization = {
  accessLevel: AccessLevel.Admin,
  dbRole: DbRole.Committee,
  effectiveCommitteeRoles: [
    {
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Coordinator,
    },
  ],
};

const techMember: Authorization = {
  accessLevel: AccessLevel.Admin,
  dbRole: DbRole.Committee,
  effectiveCommitteeRoles: [
    {
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Member,
    },
  ],
};

const overallChair: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  effectiveCommitteeRoles: [
    {
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Chair,
    },
    {
      identifier: CommitteeIdentifier.viceCommittee,
      role: CommitteeRole.Chair,
    },
  ],
};

const dancerRelationsChair: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  effectiveCommitteeRoles: [
    {
      identifier: CommitteeIdentifier.dancerRelationsCommittee,
      role: CommitteeRole.Chair,
    },
  ],
};

const dancerRelationsCoordinator: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  effectiveCommitteeRoles: [
    {
      identifier: CommitteeIdentifier.dancerRelationsCommittee,
      role: CommitteeRole.Coordinator,
    },
  ],
};

const dancerRelationsMember: Authorization = {
  accessLevel: AccessLevel.Committee,
  dbRole: DbRole.Committee,
  effectiveCommitteeRoles: [
    {
      identifier: CommitteeIdentifier.dancerRelationsCommittee,
      role: CommitteeRole.Member,
    },
  ],
};

const member: Authorization = {
  accessLevel: AccessLevel.UKY,
  dbRole: DbRole.UKY,
  effectiveCommitteeRoles: [],
};

const publicAuth: Authorization = {
  accessLevel: AccessLevel.Public,
  dbRole: DbRole.Public,
  effectiveCommitteeRoles: [],
};

const none: Authorization = {
  accessLevel: AccessLevel.None,
  dbRole: DbRole.None,
  effectiveCommitteeRoles: [],
};
describe("checkAuthorization", () => {
  it("should return true when the user's access level matches the required access level", async () => {
    expect.hasAssertions();

    await expect(
      checkAuthorization({ accessLevel: AccessLevel.Admin }, techChair)
    ).resolves.toBe(true);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.Admin }, techCoordinator)
    ).resolves.toBe(true);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.Admin }, techMember)
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        overallChair
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        dancerRelationsChair
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        dancerRelationsCoordinator
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        { accessLevel: AccessLevel.Committee },
        dancerRelationsMember
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.UKY }, member)
    ).resolves.toBe(true);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.Public }, publicAuth)
    ).resolves.toBe(true);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.None }, none)
    ).resolves.toBe(true);
  });

  // TODO: Make the rest of these async

  it("should return true when the user's access level is higher than the required access level", async () => {
    expect.assertions(3);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.Committee }, techChair)
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        { accessLevel: AccessLevel.Committee },
        techCoordinator
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.Committee }, techMember)
    ).resolves.toBe(true);
  });

  it("should return false when the user's access level is lower than the required access level", async () => {
    expect.assertions(4);
    await expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        dancerRelationsMember
      )
    ).resolves.toBe(false);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.UKY }, publicAuth)
    ).resolves.toBe(false);
    await expect(
      checkAuthorization({ accessLevel: AccessLevel.Public }, none)
    ).resolves.toBe(false);
    await expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        none
      )
    ).resolves.toBe(false);
  });

  it("should work with committeeIdentifier matching", async () => {
    expect.assertions(2);
    await expect(
      checkAuthorization(
        {
          committeeIdentifier: CommitteeIdentifier.techCommittee,
        },
        techChair
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        {
          committeeIdentifier: CommitteeIdentifier.techCommittee,
        },
        none
      )
    ).resolves.toBe(false);
  });

  it("should work with committeeIdentifiers matching", async () => {
    expect.assertions(2);
    await expect(
      checkAuthorization(
        {
          committeeIdentifiers: [
            CommitteeIdentifier.techCommittee,
            CommitteeIdentifier.viceCommittee,
          ],
        },
        techChair
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        {
          committeeIdentifiers: [
            CommitteeIdentifier.techCommittee,
            CommitteeIdentifier.viceCommittee,
          ],
        },
        none
      )
    ).resolves.toBe(false);
  });

  it("should work with minimum committeeRole matching", async () => {
    expect.assertions(3);
    await expect(
      checkAuthorization(
        {
          minCommitteeRole: CommitteeRole.Chair,
        },
        techChair
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        {
          minCommitteeRole: CommitteeRole.Coordinator,
        },
        techChair
      )
    ).resolves.toBe(true);
    await expect(
      checkAuthorization(
        {
          minCommitteeRole: CommitteeRole.Coordinator,
        },
        none
      )
    ).resolves.toBe(false);
  });
});
