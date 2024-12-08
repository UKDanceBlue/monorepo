import { randomUUID } from "node:crypto";

import { describe, expect } from "vitest";

import { MembershipPositionType } from "../api/resources/Membership.js";
import { TeamType } from "../api/resources/Team.js";
import type { Action, AppAbility, Subject } from "./accessControl.js";
import {
  type CaslParam,
  getAuthorizationFor,
  SubjectStrings,
} from "./accessControl.js";
import { AccessLevel } from "./structures.js";

describe("Unauthenticated user", (test) => {
  const context: CaslParam = {
    accessLevel: AccessLevel.None,
    effectiveCommitteeRoles: [],
    teamMemberships: [],
    userId: randomUUID(),
  };
  const ability = getAuthorizationFor(context);

  test("has no permissions for most resources", ({ expect }) => {
    for (const resource of SubjectStrings) {
      if (resource === "ConfigurationNode" || resource === "DeviceNode") {
        continue;
      }

      expect(ability).cannot("get", resource);
      expect(ability).cannot("list", resource);
      expect(ability).cannot("readActive", resource);
      expect(ability).cannot("update", resource);
    }
  });

  test("has permission to read active configuration", ({ expect }) => {
    expect(ability).can("readActive", "ConfigurationNode");

    expect(ability).cannot("get", "ConfigurationNode");
    expect(ability).cannot("list", "ConfigurationNode");
    expect(ability).cannot("update", "ConfigurationNode");
  });

  test("has permission to read a device by uuid", ({ expect }) => {
    expect(ability).can("get", "DeviceNode");

    expect(ability).cannot("readActive", "DeviceNode");
    expect(ability).cannot("list", "DeviceNode");
    expect(ability).cannot("update", "DeviceNode");
  });
});

describe("Super-admin authorization", (test) => {
  const context: CaslParam = {
    accessLevel: AccessLevel.SuperAdmin,
    effectiveCommitteeRoles: [],
    teamMemberships: [],
    userId: randomUUID(),
  };
  const ability = getAuthorizationFor(context);

  test("has all permissions", ({ expect }) => {
    expect(ability).can("manage", "all");
  });

  test("has all permissions individually", ({ expect }) => {
    for (const resource of SubjectStrings) {
      expect(ability).can("manage", resource, ".");
    }
  });

  test("had no permission for non-existent fields", ({ expect }) => {
    for (const resource of SubjectStrings) {
      expect(ability).cannot(
        "manage",
        resource,
        "~nonexistent~" as `.${string}`
      );
    }
  });
});

describe("A normal user", (test) => {
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

  test("can only read their own information", ({ expect }) => {
    expect(ability).can("get", self);
    expect(ability).cannot("list", "PersonNode");
    expect(ability).cannot("update", self);
    expect(ability).cannot("get", other);
  });

  test("can only read their own memberships", ({ expect }) => {
    expect(ability).can("list", self, ".memberships");
    expect(ability).cannot("update", self, ".memberships");
    expect(ability).cannot("list", other, ".memberships");
  });

  test("can only read their own fundraising assignments", ({ expect }) => {
    expect(ability).can("list", self, ".fundraisingAssignments");
    expect(ability).cannot("update", self, ".fundraisingAssignments");
    expect(ability).cannot("list", other, ".fundraisingAssignments");
  });

  test("can only read the list of teams", ({ expect }) => {
    expect(ability).can("list", "TeamNode");
    expect(ability).cannot("get", "TeamNode");
    expect(ability).cannot("update", "TeamNode");
  });

  test("can read events", ({ expect }) => {
    expect(ability).can("get", "EventNode");
    expect(ability).can("list", "EventNode");
    expect(ability).cannot("update", "EventNode");
  });

  test("can read committees", ({ expect }) => {
    expect(ability).can("get", "CommitteeNode");
    expect(ability).can("list", "CommitteeNode");
    expect(ability).cannot("update", "CommitteeNode");
  });

  test("can read images", ({ expect }) => {
    expect(ability).can("get", "ImageNode");
    expect(ability).can("list", "ImageNode");
    expect(ability).cannot("update", "ImageNode");
  });

  test("can only read the active marathon", ({ expect }) => {
    expect(ability).can("readActive", "MarathonNode");
    expect(ability).cannot("get", "MarathonNode");
    expect(ability).cannot("list", "MarathonNode");
  });

  test("can only read the active marathon hour", ({ expect }) => {
    expect(ability).can("readActive", "MarathonHourNode");
    expect(ability).cannot("get", "MarathonHourNode");
    expect(ability).cannot("list", "MarathonHourNode");
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
    expect(ability).can("get", team1);
    expect(ability).can("list", team2);
    expect(ability).cannot("update", team1);
  });

  test("has correct permissions for team members", ({ expect }) => {
    expect(ability).can("list", team1, ".members");
    expect(ability).cannot("update", team1, ".members");
    expect(ability).cannot("list", team2, ".members");
  });

  test("has correct permissions for team fundraising assignments", ({
    expect,
  }) => {
    expect(ability).cannot("list", team1, ".fundraisingAssignments");
    expect(ability).cannot("list", team2, ".fundraisingAssignments");
  });

  test("has correct permissions for team solicitation code", ({ expect }) => {
    expect(ability).cannot("get", team1, ".solicitationCode");
    expect(ability).cannot("get", team2, ".solicitationCode");
    expect(ability).cannot("update", team1, ".solicitationCode");
  });

  test("has correct permissions for team fundraising total", ({ expect }) => {
    expect(ability).can("get", team1, ".fundraisingTotal");
    expect(ability).cannot("get", team2, ".fundraisingTotal");
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
    expect(ability).can("get", team1);
    expect(ability).can("get", team2);
    expect(ability).cannot("get", team3);
  });

  test("has correct permissions for team members", ({ expect }) => {
    expect(ability).can("list", team1, ".members");
    expect(ability).cannot("update", team1, ".members");
    expect(ability).can("list", team2, ".members");
    expect(ability).cannot("list", team3, ".members");
  });

  test("has correct permissions for team fundraising assignments", ({
    expect,
  }) => {
    expect(ability).can("modify", team1, ".fundraisingAssignments");
    expect(ability).cannot("modify", team2, ".fundraisingAssignments");
    expect(ability).cannot("modify", team3, ".fundraisingAssignments");
  });

  test("has correct permissions for team solicitation code", ({ expect }) => {
    expect(ability).can("get", team1, ".solicitationCode");
    expect(ability).cannot("update", team1, ".solicitationCode");
    expect(ability).cannot("get", team2, ".solicitationCode");
    expect(ability).cannot("get", team3, ".solicitationCode");
  });

  test("has correct permissions for team fundraising total", ({ expect }) => {
    expect(ability).can("get", team1, ".fundraisingTotal");
    expect(ability).can("get", team2, ".fundraisingTotal");
    expect(ability).cannot("get", team3, ".fundraisingTotal");
  });
});

describe("Admin authorization", (test) => {
  const userId = randomUUID();
  const context: CaslParam = {
    accessLevel: AccessLevel.Admin,
    effectiveCommitteeRoles: [],
    teamMemberships: [],
    userId,
  };
  const ability = getAuthorizationFor(context);

  test("has correct permissions for admin", ({ expect }) => {
    expect(ability).can("manage", "ConfigurationNode", ".");
    expect(ability).can("manage", "MarathonNode", ".");
    expect(ability).can("manage", "MarathonHourNode", ".");
    expect(ability).can("manage", "FundraisingAssignmentNode", ".");
    expect(ability).can("manage", "FundraisingEntryNode", ".");
    expect(ability).can("deploy", "NotificationNode", ".");
  });
});

describe("Committee chair or coordinator authorization", (test) => {
  const userId = randomUUID();
  const context: CaslParam = {
    accessLevel: AccessLevel.CommitteeChairOrCoordinator,
    effectiveCommitteeRoles: [],
    teamMemberships: [],
    userId,
  };
  const ability = getAuthorizationFor(context);

  test("has correct permissions for committee chair or coordinator", ({
    expect,
  }) => {
    expect(ability).can("manage", "CommitteeNode", ".");
    expect(ability).can("manage", "EventNode", ".");
    expect(ability).can("manage", "FeedNode", ".");
    expect(ability).can("manage", "ImageNode", ".");
    expect(ability).can("manage", "MembershipNode", ".");
    expect(ability).can("manage", "PersonNode", ".");
    expect(ability).can("manage", "PersonNode", ".memberships");
    expect(ability).can("read", "MarathonHourNode", ".");
    expect(ability).can("read", "MarathonNode", ".");
    expect(ability).can("modify", "NotificationNode", ".");
    expect(ability).can("create", "NotificationNode", ".");
    expect(ability).can("read", "NotificationNode", ".deliveryIssue");
    expect(ability).can(
      "read",
      "NotificationNode",
      ".deliveryIssueAcknowledgedAt"
    );
    expect(ability).can(
      "read",
      "NotificationDeliveryNode",
      ".receiptCheckedAt"
    );
    expect(ability).can("read", "NotificationDeliveryNode", ".chunkUuid");
    expect(ability).can("read", "NotificationDeliveryNode", ".deliveryError");
  });
});

function canMessage(
  not: boolean,
  action: string,
  subject: Subject,
  field: string
) {
  return `expected ${not ? "not " : ""}to be able to ${action} ${typeof subject === "string" ? subject : `${subject.kind}[id=${subject.id}]`}${field}`;
}

expect.extend({
  can(
    received: AppAbility,
    ...[action, subject, field]: Parameters<AppAbility["can"]>
  ) {
    const { isNot } = this;

    const result = received.can(action, subject, field ?? ".");
    const message = () => canMessage(isNot, action, subject, field ?? ".");
    return {
      pass: result,
      message,
    };
  },
  cannot(
    received: AppAbility,
    ...[action, subject, field]: Parameters<AppAbility["can"]>
  ) {
    const { isNot } = this;

    const result = received.cannot(action, subject, field ?? ".");
    const message = () => canMessage(!isNot, action, subject, field ?? ".");
    return {
      pass: result,
      message,
    };
  },
});

interface CustomMatchers<R = unknown> {
  can(
    action: Omit<Action, "read" | "modify">,
    subject: Subject,
    field?: `.${string}`
  ): R;
  cannot(
    action: Omit<Action, "read" | "modify">,
    subject: Subject,
    field?: `.${string}`
  ): R;
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends CustomMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
