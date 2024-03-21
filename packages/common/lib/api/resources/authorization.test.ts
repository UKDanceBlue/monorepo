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
  committeeIdentifier: CommitteeIdentifier.techCommittee,
  committeeRole: CommitteeRole.Chair,
};

const techCoordinator: Authorization = {
  accessLevel: AccessLevel.Admin,
  dbRole: DbRole.Committee,
  committeeIdentifier: CommitteeIdentifier.techCommittee,
  committeeRole: CommitteeRole.Coordinator,
};

const techMember: Authorization = {
  accessLevel: AccessLevel.Admin,
  dbRole: DbRole.Committee,
  committeeIdentifier: CommitteeIdentifier.techCommittee,
  committeeRole: CommitteeRole.Member,
};

const overallChair: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  committeeIdentifier: CommitteeIdentifier.viceCommittee,
  committeeRole: CommitteeRole.Chair,
};

const dancerRelationsChair: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
  committeeRole: CommitteeRole.Chair,
};

const dancerRelationsCoordinator: Authorization = {
  accessLevel: AccessLevel.CommitteeChairOrCoordinator,
  dbRole: DbRole.Committee,
  committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
  committeeRole: CommitteeRole.Coordinator,
};

const dancerRelationsMember: Authorization = {
  accessLevel: AccessLevel.Committee,
  dbRole: DbRole.Committee,
  committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
  committeeRole: CommitteeRole.Member,
};

const member: Authorization = {
  accessLevel: AccessLevel.UKY,
  dbRole: DbRole.UKY,
};

const publicAuth: Authorization = {
  accessLevel: AccessLevel.Public,
  dbRole: DbRole.Public,
};

const none: Authorization = {
  accessLevel: AccessLevel.None,
  dbRole: DbRole.None,
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
        { accessLevel: AccessLevel.None, dbRole: DbRole.None }
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          custom() {
            return false;
          },
        },
        { accessLevel: AccessLevel.None, dbRole: DbRole.None }
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

  it("should work with exact committeeRole matching", () => {
    expect(
      checkAuthorization(
        {
          committeeRole: CommitteeRole.Chair,
        },
        techChair
      )
    ).toBe(true);
    expect(
      checkAuthorization(
        {
          committeeRole: CommitteeRole.Chair,
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
          committeeRole: CommitteeRole.Chair,
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
