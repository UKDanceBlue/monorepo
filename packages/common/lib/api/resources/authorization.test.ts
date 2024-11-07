import { describe, expect, it } from "vitest";

import { checkAuthorization } from "../../authorization/accessControl.js";
import type { Authorization } from "../../index.js";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
} from "../../index.js";

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

    expect(
      checkAuthorization({ accessLevel: AccessLevel.Admin }, techChair)
    ).toBe(true);
    expect(
      checkAuthorization({ accessLevel: AccessLevel.Admin }, techCoordinator)
    ).toBe(true);
    expect(
      checkAuthorization({ accessLevel: AccessLevel.Admin }, techMember)
    ).toBe(true);
    expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        overallChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        dancerRelationsChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        dancerRelationsCoordinator
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        { accessLevel: AccessLevel.Committee },
        dancerRelationsMember
      )
    ).toBe(true);
    expect(checkAuthorization({ accessLevel: AccessLevel.UKY }, member)).toBe(
      true
    );
    expect(
      checkAuthorization({ accessLevel: AccessLevel.Public }, publicAuth)
    ).toBe(true);
    expect(checkAuthorization({ accessLevel: AccessLevel.None }, none)).toBe(
      true
    );
  });

  // TODO: Make the rest of these async

  it("should return true when the user's access level is higher than the required access level", async () => {
    expect.assertions(3);
    expect(
      checkAuthorization({ accessLevel: AccessLevel.Committee }, techChair)
    ).toBe(true);
    expect(
      checkAuthorization(
        { accessLevel: AccessLevel.Committee },
        techCoordinator
      )
    ).toBe(true);
    expect(
      checkAuthorization({ accessLevel: AccessLevel.Committee }, techMember)
    ).toBe(true);
  });

  it("should return false when the user's access level is lower than the required access level", async () => {
    expect.assertions(4);
    expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        dancerRelationsMember
      )
    ).toBe(false);
    expect(
      checkAuthorization({ accessLevel: AccessLevel.UKY }, publicAuth)
    ).toBe(false);
    expect(checkAuthorization({ accessLevel: AccessLevel.Public }, none)).toBe(
      false
    );
    expect(
      checkAuthorization(
        { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
        none
      )
    ).toBe(false);
  });

  it("should work with committeeIdentifier matching", async () => {
    expect.assertions(2);
    expect(
      checkAuthorization(
        {
          committeeIdentifier: CommitteeIdentifier.techCommittee,
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          committeeIdentifier: CommitteeIdentifier.techCommittee,
        },
        none
      )
    ).toBe(false);
  });

  it("should work with committeeIdentifiers matching", async () => {
    expect.assertions(2);
    expect(
      checkAuthorization(
        {
          committeeIdentifiers: [
            CommitteeIdentifier.techCommittee,
            CommitteeIdentifier.viceCommittee,
          ],
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          committeeIdentifiers: [
            CommitteeIdentifier.techCommittee,
            CommitteeIdentifier.viceCommittee,
          ],
        },
        none
      )
    ).toBe(false);
  });

  it("should work with minimum committeeRole matching", async () => {
    expect.assertions(3);
    expect(
      checkAuthorization(
        {
          minCommitteeRole: CommitteeRole.Chair,
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          minCommitteeRole: CommitteeRole.Coordinator,
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          minCommitteeRole: CommitteeRole.Coordinator,
        },
        none
      )
    ).toBe(false);
  });
});
