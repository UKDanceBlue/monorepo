import type {
  AbilityOptionsOf,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from "@casl/ability";
import {
  AbilityBuilder,
  createAliasResolver,
  createMongoAbility,
} from "@casl/ability";
import validator from "validator";

import type { EffectiveCommitteeRole } from "../api/resources/index.js";
import {
  parseGlobalId,
  type PersonNode,
  type ResourceClasses,
} from "../api/resources/index.js";
import { MembershipPositionType } from "../api/resources/Membership.js";
import type { TeamType } from "../api/resources/Team.js";
import type { Authorization } from "./structures.js";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
} from "./structures.js";

export interface SimpleTeamMembership {
  teamType: TeamType;
  teamId: string;
  position: MembershipPositionType;
}

const NEVER = {} as never;
const extraFieldsByResource = {
  PersonNode: {
    [".fundraisingAssignments"]: NEVER,
    [".memberships"]: NEVER,
    [".password"]: NEVER,
  },
  TeamNode: {
    [".fundraisingAssignments"]: NEVER,
    [".members"]: NEVER,
    [".solicitationCode"]: NEVER,
    [".fundraisingTotal"]: NEVER,
  },
  FundraisingAssignmentNode: {
    [".withinTeamIds"]: NEVER,
  },
  NotificationNode: {
    [".deliveryIssue"]: NEVER,
    [".deliveryIssueAcknowledgedAt"]: NEVER,
  },
  NotificationDeliveryNode: {
    [".receiptCheckedAt"]: NEVER,
    [".chunkUuid"]: NEVER,
    [".deliveryError"]: NEVER,
  },
  AuditLogNode: {},
  FundraisingEntryNode: {},
  CommitteeNode: {},
  ConfigurationNode: {},
  DailyDepartmentNotificationNode: {},
  DailyDepartmentNotificationBatchNode: {},
  ImageNode: {},
  MarathonNode: {},
  MarathonHourNode: {},
  PointEntryNode: {},
  PointOpportunityNode: {},
  SolicitationCodeNode: {},
  DeviceNode: {},
  EventNode: {},
  FeedNode: {},
  MembershipNode: {},
};

type ResourceSubject = {
  [resource in keyof typeof ResourceClasses]: {
    kind: resource;
    id?: string;

    // When allowing access to a resource, passing in no fields will allow access to all fields,
    // so by passing in this $ field, we can change that behavior to default to no fields.
    ["."]?: never;
  } & Partial<(typeof extraFieldsByResource)[resource]>;
};

type SubjectValue = ResourceSubject[keyof ResourceSubject];
export type Subject = InferSubjects<SubjectValue | "all", true>;

export const SubjectStrings = [
  ...(Object.keys(
    extraFieldsByResource
  ) as (keyof typeof extraFieldsByResource)[]),
  "all",
] as const satisfies Subject[];

export type Action =
  | "create"
  | "get"
  | "list"
  | "read"
  | "update"
  | "delete"
  | "modify"
  | "manage"
  | "readActive"
  | "deploy";

const resolveAction = createAliasResolver({
  ["modify"]: ["read", "update", "delete"],
  ["read"]: ["get", "list"],
});

export type AppAbility = MongoAbility<[Action, Subject]>;

export interface AuthorizationContext extends Authorization {
  authenticatedUser: PersonNode | null;
  teamMemberships: SimpleTeamMembership[];
}

export const caslOptions: AbilityOptionsOf<AppAbility> = {
  resolveAction,
  detectSubjectType(subject) {
    return ((subject as { __typename?: Subject }).__typename ??
      subject.kind) as ExtractSubjectType<Subject>;
  },
};

export interface CaslParam
  extends Pick<
    AuthorizationContext,
    "accessLevel" | "teamMemberships" | "effectiveCommitteeRoles"
  > {
  userId: string | null;
}

export function getAuthorizationFor({
  accessLevel,
  userId,
  teamMemberships,
  effectiveCommitteeRoles,
}: CaslParam): AppAbility {
  const { can: allow, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  // All users may read active configurations and get device information (with that device's uuid)
  allow("readActive", ["ConfigurationNode"], ".");
  allow("get", ["DeviceNode"], ".");
  // All users may read active feeds and marathon info
  allow("readActive", ["FeedNode", "MarathonNode", "MarathonHourNode"], ".");

  if (accessLevel > AccessLevel.None) {
    if (accessLevel === AccessLevel.SuperAdmin) {
      // Super admins may manage all resources
      allow(
        "manage",
        "all",
        Object.values(extraFieldsByResource).reduce<string[]>(
          (acc, fields) => acc.concat(Object.keys(fields)),
          ["."]
        )
      );
    } else {
      // All users may read committees, events, and images
      allow("get", ["ImageNode"], ".");
      // All users may list teams
      allow("list", ["TeamNode", "EventNode"], ".");

      applyAccessLevelPermissions(accessLevel, allow);
      applyCommitteePermissions(effectiveCommitteeRoles, allow);

      if (userId != null) applyUserPermissions(userId, allow);

      if (teamMemberships.length > 0)
        applyTeamPermissions(teamMemberships, allow);
    }
  }

  return build(caslOptions);
}

function applyTeamPermissions(
  teamMemberships: SimpleTeamMembership[],
  allow: AbilityBuilder<AppAbility>["can"]
) {
  const authTeamMemberships: string[] = [];
  const authTeamCaptaincies: string[] = [];
  for (const membership of teamMemberships) {
    if (membership.position === MembershipPositionType.Captain) {
      authTeamCaptaincies.push(membership.teamId);
    }
    authTeamMemberships.push(membership.teamId);
  }

  // Members of a team may read the team's information and fundraising total
  allow("get", "TeamNode", [".", ".fundraisingTotal"], {
    id: { $in: authTeamMemberships },
  });
  // Members of a team may read the team's members
  allow("list", "TeamNode", [".members"], {
    id: { $in: authTeamMemberships },
  });

  // Captains of a team may manage the team's fundraising assignments
  allow(["modify", "create"], "TeamNode", [".fundraisingAssignments"], {
    id: { $in: authTeamCaptaincies },
  });
  // Captains of a team may get the team's solicitation code
  allow("get", "TeamNode", [".solicitationCode"], {
    id: { $in: authTeamCaptaincies },
  });
  // Captains of a team may view the team's fundraising entries
  allow("read", "TeamNode", [".fundraisingEntries"], {
    id: { $in: authTeamCaptaincies },
  });
}

function applyUserPermissions(
  userId: string,
  allow: AbilityBuilder<AppAbility>["can"]
) {
  const parsedUserId = validator.isUUID(userId)
    ? userId
    : parseGlobalId(userId).unwrap().id;

  // Users may read their own information
  allow("get", "PersonNode", ["."], {
    id: {
      $eq: parsedUserId,
    },
  });
  // Users may read their own memberships and fundraising assignments
  allow("read", "PersonNode", [".memberships", ".fundraisingAssignments"], {
    id: {
      $eq: parsedUserId,
    },
  });
}

function applyCommitteePermissions(
  effectiveCommitteeRoles: EffectiveCommitteeRole[],
  allow: AbilityBuilder<AppAbility>["can"]
) {
  for (const { identifier, role } of effectiveCommitteeRoles) {
    // Members of vice committee may read all members and teams
    // Coords/Chairs of vice committee may manage all members and teams
    if (identifier === CommitteeIdentifier.viceCommittee) {
      allow(role === CommitteeRole.Member ? "read" : "manage", "PersonNode", [
        ".",
        ".memberships",
      ]);
      allow(role === CommitteeRole.Member ? "read" : "manage", "TeamNode", [
        ".",
        ".members",
      ]);
      allow("list", "PointEntryNode", ".");
    }

    // Coords/Chairs of vice, community, tech, and marketing committees may deploy notifications
    if (
      role !== CommitteeRole.Member &&
      (identifier === CommitteeIdentifier.viceCommittee ||
        identifier === CommitteeIdentifier.communityDevelopmentCommittee ||
        identifier === CommitteeIdentifier.techCommittee ||
        identifier === CommitteeIdentifier.marketingCommittee)
    ) {
      allow("deploy", "NotificationNode", ".");
    }

    // Members of dancer relations committee may manage point opportunities, point entries, and team members
    if (identifier === CommitteeIdentifier.dancerRelationsCommittee) {
      allow("manage", ["PointOpportunityNode", "PointEntryNode"], ".");
      allow("manage", "TeamNode", ".members");
    }

    // Members of programming committee may manage marathon hours
    if (identifier === CommitteeIdentifier.programmingCommittee) {
      allow("manage", "MarathonHourNode", ".");
    }

    // Members of fundraising committee may manage fundraising entries, daily department notifications, solicitation codes, and fundraising assignments
    if (identifier === CommitteeIdentifier.fundraisingCommittee) {
      allow(
        "manage",
        [
          "FundraisingEntryNode",
          "DailyDepartmentNotificationNode",
          "SolicitationCodeNode",
          "FundraisingAssignmentNode",
        ],
        "."
      );
      allow("manage", "TeamNode", [
        ".fundraisingAssignments",
        ".solicitationCode",
        ".fundraisingEntries",
      ]);
      allow("read", "TeamNode", ".fundraisingTotal");
    }
  }
}

function applyAccessLevelPermissions(
  accessLevel: number,
  allow: AbilityBuilder<AppAbility>["can"]
) {
  // Coords/Chairs of any committee may:
  if (accessLevel >= AccessLevel.CommitteeChairOrCoordinator) {
    // Manage committees, events, feeds, images, and memberships
    allow(
      "manage",
      ["EventNode", "FeedNode", "ImageNode", "MembershipNode"],
      "."
    );
    // Manage people and their memberships
    allow("manage", "PersonNode", [".", ".memberships"]);
    // Read marathon info
    allow("read", ["MarathonHourNode", "MarathonNode"], ".");
    // Create (but not send) notifications
    allow(["modify", "create"], "NotificationNode", ".");
    // Read notifications
    allow("read", "NotificationNode", [
      ".",
      ".deliveryIssue",
      ".deliveryIssueAcknowledgedAt",
    ]);
    // Read notification deliveries
    allow("read", "NotificationDeliveryNode", [
      ".",
      ".receiptCheckedAt",
      ".chunkUuid",
      ".deliveryError",
    ]);
  }

  // Admins may:
  if (accessLevel >= AccessLevel.Admin) {
    // Manage configurations, marathons, marathon hours, fundraising assignments, and fundraising entries
    allow(
      "manage",
      [
        "ConfigurationNode",
        "MarathonNode",
        "MarathonHourNode",
        "FundraisingAssignmentNode",
        "FundraisingEntryNode",
      ],
      "."
    );
    allow("read", "AuditLogNode", ".");
    // Manage teams and their assignments and solicitation code
    allow("manage", "TeamNode", [
      ".fundraisingAssignments",
      ".solicitationCode",
      ".fundraisingEntries",
    ]);
    // Read fundraising totals
    allow("read", "TeamNode", ".fundraisingTotal");
    // Deploy notifications
    allow("deploy", "NotificationNode", ".");
    allow("manage", "PersonNode", ".password");
  }
}
