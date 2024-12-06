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
    [".members"]: NEVER,
  },
  TeamNode: {
    [".fundraisingAssignments"]: NEVER,
    [".memberships"]: NEVER,
    [".solicitationCode"]: NEVER,
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
type Subject = InferSubjects<SubjectValue | "all", true>;

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
  ["read"]: ["get", "list", "readActive"],
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
  const {
    can: allow,
    // cannot: forbid,
    build,
  } = new AbilityBuilder<AppAbility>(createMongoAbility);

  function doBuild() {
    return build(caslOptions);
  }

  if (accessLevel === AccessLevel.None) {
    return doBuild();
  }
  if (accessLevel === AccessLevel.SuperAdmin) {
    allow("manage", "all");
    return doBuild();
  }

  allow("get", "DeviceNode", ".");
  allow(
    "readActive",
    ["FeedNode", "ConfigurationNode", "MarathonNode", "MarathonHourNode"],
    "."
  );
  allow("read", ["CommitteeNode", "EventNode", "ImageNode", "TeamNode"], ".");

  if (accessLevel >= AccessLevel.Committee) {
    allow("read", ["SolicitationCodeNode"], ".");
  }

  if (accessLevel >= AccessLevel.CommitteeChairOrCoordinator) {
    allow(
      "manage",
      ["CommitteeNode", "EventNode", "FeedNode", "ImageNode", "MembershipNode"],
      "."
    );
    allow("manage", "PersonNode", [".memberships"]);
    allow("read", "NotificationDeliveryNode", ".");
    allow(["modify", "create"], "NotificationNode", ".");
    allow("read", "NotificationNode", [
      ".deliveryIssue",
      ".deliveryIssueAcknowledgedAt",
    ]);
    allow("read", "NotificationDeliveryNode", [
      ".receiptCheckedAt",
      ".chunkUuid",
      ".deliveryError",
    ]);
  }

  if (accessLevel >= AccessLevel.Admin) {
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
    allow("deploy", "NotificationNode", ".");
  }

  for (const { identifier, role } of effectiveCommitteeRoles) {
    switch (identifier) {
      case CommitteeIdentifier.viceCommittee: {
        allow(
          role === CommitteeRole.Member ? "read" : "manage",
          "PersonNode",
          ".memberships"
        );
        allow(
          role === CommitteeRole.Member ? "read" : "manage",
          "TeamNode",
          ".members"
        );
        // fallthrough
      }
      case CommitteeIdentifier.communityDevelopmentCommittee:
      case CommitteeIdentifier.techCommittee:
      case CommitteeIdentifier.marketingCommittee: {
        if (role !== CommitteeRole.Member) {
          allow("deploy", "NotificationNode", ".");
        }
        break;
      }
      case CommitteeIdentifier.dancerRelationsCommittee: {
        allow("manage", ["PointOpportunityNode", "PointEntryNode"], ".");
        allow("manage", "TeamNode", ".members");
        break;
      }
      case CommitteeIdentifier.fundraisingCommittee: {
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
        ]);
        allow("read", "TeamNode", ".fundraisingTotal");
        break;
      }
    }
  }

  const parsedUserId = userId
    ? validator.isUUID(userId)
      ? userId
      : parseGlobalId(userId).unwrap().id
    : null;

  if (parsedUserId) {
    allow("read", "PersonNode", [".memberships", ".fundraisingAssignments"], {
      id: {
        $eq: parsedUserId,
      },
    });
  }

  const authTeamMemberships = teamMemberships.map(
    (membership) => membership.teamId
  );

  if (authTeamMemberships.length > 0) {
    allow("read", "TeamNode", ".members", {
      id: { $in: authTeamMemberships },
    });
  }

  const authTeamCaptaincies = teamMemberships
    .filter(
      (membership) => membership.position === MembershipPositionType.Captain
    )
    .map((membership) => membership.teamId);
  if (authTeamCaptaincies.length > 0) {
    // allow("read", "PersonNode", {
    //   withinTeamIds: { $in: authTeamCaptaincies },
    // });
    // allow(["modify", "create"], "FundraisingAssignmentNode", {
    //   withinTeamIds: { $in: authTeamCaptaincies },
    // });
    // allow("read", "FundraisingEntryNode", {
    //   childOfType: "TeamNode",
    //   childOfId: { $in: authTeamCaptaincies },
    // });
    // allow("read", "TeamNode", "fundraisingEntries", {
    //   id: { $in: authTeamMemberships },
    // });
    allow(["modify", "create"], "TeamNode", ".fundraisingAssignments");
  }

  return doBuild();
}
