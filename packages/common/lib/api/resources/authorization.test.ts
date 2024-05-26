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
  committees: [
    {
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Chair,
    },
  ],
};

const techCoordinator: Authorization = {
  accessLevel: AccessLevel.Admin,
  dbRole: DbRole.Committee,
  committees: [
    {
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Coordinator,
    },
  ],
};

const techMember: Authorization = {
  accessLevel: AccessLevel.Admin,
  dbRole: DbRole.Committee,
  committees: [
    {
      identifier: CommitteeIdentifier.techCommittee,
      role: CommitteeRole.Member,
    },
  ],
};

const overallChair: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  committees: [
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
  committees: [
    {
      identifier: CommitteeIdentifier.dancerRelationsCommittee,
      role: CommitteeRole.Chair,
    },
  ],
};

const dancerRelationsCoordinator: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  committees: [
    {
      identifier: CommitteeIdentifier.dancerRelationsCommittee,
      role: CommitteeRole.Coordinator,
    },
  ],
};

const dancerRelationsMember: Authorization = {
  accessLevel: AccessLevel.Committee,
  dbRole: DbRole.Committee,
  committees: [
    {
      identifier: CommitteeIdentifier.dancerRelationsCommittee,
      role: CommitteeRole.Member,
    },
  ],
};

const member: Authorization = {
  accessLevel: AccessLevel.UKY,
  dbRole: DbRole.UKY,
  committees: [],
};

const publicAuth: Authorization = {
  accessLevel: AccessLevel.Public,
  dbRole: DbRole.Public,
  committees: [],
};

const none: Authorization = {
  accessLevel: AccessLevel.None,
  dbRole: DbRole.None,
  committees: [],
};
describe("checkAuthorization", () => {
  it("should return true when the user's access level matches the required access level", () => {
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

  it("should return true when the user's access level is higher than the required access level", () => {
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

  it("should return false when the user's access level is lower than the required access level", () => {
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

  it("should work with a custom check function", () => {
    expect(
      checkAuthorization(
        {
          custom() {
            return true;
          },
        },
        { accessLevel: AccessLevel.None, dbRole: DbRole.None, committees: [] }
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          custom() {
            return false;
          },
        },
        { accessLevel: AccessLevel.None, dbRole: DbRole.None, committees: [] }
      )
    ).toBe(false);
  });

  it("should work with committeeIdentifier matching", () => {
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

  it("should work with committeeIdentifiers matching", () => {
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

  it("should work with exact dbRole matching", () => {
    expect(
      checkAuthorization(
        {
          dbRole: DbRole.Committee,
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          dbRole: DbRole.Committee,
        },
        none
      )
    ).toBe(false);
  });

  it("should work with minimum dbRole matching", () => {
    expect(
      checkAuthorization(
        {
          minDbRole: DbRole.Committee,
        },
        techChair
      )
    ).toBe(true);
  });

  it("should work with minimum committeeRole matching", () => {
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

  it("should work with all of the above", () => {
    expect(
      checkAuthorization(
        {
          accessLevel: AccessLevel.Admin,
          dbRole: DbRole.Committee,
          committeeIdentifier: CommitteeIdentifier.techCommittee,
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          accessLevel: AccessLevel.Admin,
          committeeIdentifier: CommitteeIdentifier.techCommittee,
          minDbRole: DbRole.Committee,
          minCommitteeRole: CommitteeRole.Coordinator,
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          accessLevel: AccessLevel.Admin,
          committeeIdentifier: CommitteeIdentifier.techCommittee,
          minCommitteeRole: CommitteeRole.Chair,
        },
        none
      )
    ).toBe(false);
  });
});
