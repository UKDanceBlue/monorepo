import { describe } from "vitest";

import type { Authorization } from "../../../index.js";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
} from "../../../index.js";

import { checkAuthorization } from "./authorization.js";

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

const captain: Authorization = {
  accessLevel: AccessLevel.TeamCaptain,
  dbRole: DbRole.TeamCaptain,
};

const member: Authorization = {
  accessLevel: AccessLevel.TeamMember,
  dbRole: DbRole.TeamMember,
};

const publicAuth: Authorization = {
  accessLevel: AccessLevel.Public,
  dbRole: DbRole.Public,
};

const none: Authorization = {
  accessLevel: AccessLevel.None,
  dbRole: DbRole.None,
};

describe(checkAuthorization, (it) => {
  it("should return true when the user's access level matches the required access level", (assert) => {
    assert
      .expect(checkAuthorization({ accessLevel: AccessLevel.Admin }, techChair))
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.Admin }, techCoordinator)
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.Admin }, techMember)
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization(
          { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
          overallChair
        )
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization(
          { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
          dancerRelationsChair
        )
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization(
          { accessLevel: AccessLevel.CommitteeChairOrCoordinator },
          dancerRelationsCoordinator
        )
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization(
          { accessLevel: AccessLevel.Committee },
          dancerRelationsMember
        )
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.TeamCaptain }, captain)
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.TeamMember }, member)
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.Public }, publicAuth)
      )
      .toBe(true);
    assert
      .expect(checkAuthorization({ accessLevel: AccessLevel.None }, none))
      .toBe(true);
  });

  it("should return true when the user's access level is higher than the required access level", (assert) => {
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.Committee }, techChair)
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization(
          { accessLevel: AccessLevel.Committee },
          techCoordinator
        )
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.Committee }, techMember)
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.TeamCaptain }, captain)
      )
      .toBe(true);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.TeamMember }, captain)
      )
      .toBe(true);
    assert
      .expect(checkAuthorization({ accessLevel: AccessLevel.Public }, captain))
      .toBe(true);
    assert
      .expect(checkAuthorization({ accessLevel: AccessLevel.None }, captain))
      .toBe(true);
  });

  it("should return false when the user's access level is lower than the required access level", (assert) => {
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.Committee }, overallChair)
      )
      .toBe(false);
    assert
      .expect(
        checkAuthorization(
          { accessLevel: AccessLevel.Committee },
          dancerRelationsChair
        )
      )
      .toBe(false);
    assert
      .expect(
        checkAuthorization(
          { accessLevel: AccessLevel.Committee },
          dancerRelationsCoordinator
        )
      )
      .toBe(false);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.TeamCaptain }, member)
      )
      .toBe(false);
    assert
      .expect(
        checkAuthorization({ accessLevel: AccessLevel.TeamMember }, publicAuth)
      )
      .toBe(false);
    assert
      .expect(checkAuthorization({ accessLevel: AccessLevel.Public }, none))
      .toBe(false);
  });
});
