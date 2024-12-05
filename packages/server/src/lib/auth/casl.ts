import type {
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from "@casl/ability";
import {
  AbilityBuilder,
  createAliasResolver,
  createMongoAbility,
} from "@casl/ability";
import type {
  Authorization,
  PersonNode,
  ResourceClasses,
  SimpleTeamMembership,
} from "@ukdanceblue/common";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  MembershipPositionType,
} from "@ukdanceblue/common";

type HasWithinTeamIds = "FundraisingAssignmentNode" | "PersonNode";

type HasOwnedByUserIds = "FundraisingEntryNode" | "FundraisingAssignmentNode";

type ResourceSubject = {
  [resource in keyof typeof ResourceClasses]: {
    kind: resource;
    id?: string;
    childOfType?: Subject;
    childOfId?: string;
  } & (resource extends HasWithinTeamIds
    ? { withinTeamIds: string[] }
    : { withinTeamIds?: never }) &
    (resource extends HasOwnedByUserIds
      ? { ownedByUserIds: string[] }
      : { ownedByUserIds?: never });
} & {
  AuditNode: {
    kind: "AuditNode";
  };
};

type SubjectValue = ResourceSubject[keyof ResourceSubject];
type Subject = InferSubjects<SubjectValue, true>;

export const Action = {
  Create: "create",
  Get: "get",
  List: "list",
  Read: "read",
  ReadActive: "readActive",
  Update: "update",
  Delete: "delete",
  Deploy: "deploy",
  Modify: "modify",
  Manage: "manage",
} as const;
export type Action = (typeof Action)[keyof typeof Action];

const resolveAction = createAliasResolver({
  [Action.Modify]: [Action.Read, Action.Update, Action.Delete],
  [Action.Read]: [Action.Get, Action.List, Action.ReadActive],
});

export type AppAbility = MongoAbility<
  | [
      (
        | typeof Action.Create
        | typeof Action.Get
        | typeof Action.List
        | typeof Action.ReadActive
        | typeof Action.Read
        | typeof Action.Update
        | typeof Action.Delete
        | typeof Action.Modify
        | typeof Action.Manage
      ),
      Subject | "all",
    ]
  | [typeof Action.Deploy, "NotificationNode" | "all"]
>;

export interface AuthParam extends Omit<Authorization, "dbRole"> {
  authenticatedUser: PersonNode | null;
  teamMemberships: SimpleTeamMembership[];
}

export function getAuthorizationFor({
  accessLevel,
  authenticatedUser,
  teamMemberships,
  effectiveCommitteeRoles,
}: AuthParam): AppAbility {
  const {
    can: allow,
    // cannot: forbid,
    build,
  } = new AbilityBuilder<AppAbility>(createMongoAbility);

  function doBuild() {
    return build({
      resolveAction,
      detectSubjectType(subject) {
        return ((subject as { __typename?: Subject }).__typename ??
          subject.kind) as ExtractSubjectType<Subject>;
      },
    });
  }

  if (accessLevel === AccessLevel.None) {
    return doBuild();
  }
  if (accessLevel === AccessLevel.SuperAdmin) {
    allow(Action.Manage, "all");
    return doBuild();
  }

  allow(Action.Get, "DeviceNode");
  allow(Action.ReadActive, [
    "FeedNode",
    "ConfigurationNode",
    "MarathonNode",
    "MarathonHourNode",
  ]);
  allow(Action.Read, ["CommitteeNode", "EventNode", "ImageNode", "TeamNode"]);

  allow(Action.Read, "TeamNode", "members");

  if (accessLevel >= AccessLevel.Committee) {
    allow(Action.Read, ["SolicitationCodeNode", "MembershipNode"]);
  }

  if (accessLevel >= AccessLevel.CommitteeChairOrCoordinator) {
    allow(Action.Manage, [
      "CommitteeNode",
      "EventNode",
      "FeedNode",
      "ImageNode",
      "MembershipNode",
      "PersonNode",
    ]);
    allow(Action.Read, "NotificationDeliveryNode");
    allow([Action.Modify, Action.Create], "NotificationNode");
  }

  if (accessLevel >= AccessLevel.Admin) {
    allow(Action.Manage, [
      "ConfigurationNode",
      "MarathonNode",
      "MarathonHourNode",
      "FundraisingAssignmentNode",
      "FundraisingEntryNode",
    ]);
    allow(Action.Deploy, "NotificationNode");
  }

  for (const { identifier, role } of effectiveCommitteeRoles) {
    switch (identifier) {
      case CommitteeIdentifier.viceCommittee: {
        allow(role === CommitteeRole.Member ? Action.Modify : Action.Manage, [
          "PersonNode",
        ]);
        // fallthrough
      }
      case CommitteeIdentifier.communityDevelopmentCommittee:
      case CommitteeIdentifier.techCommittee:
      case CommitteeIdentifier.marketingCommittee: {
        if (role !== CommitteeRole.Member) {
          allow(Action.Deploy, "NotificationNode");
        }
        break;
      }
      case CommitteeIdentifier.dancerRelationsCommittee: {
        allow(Action.Manage, ["PointOpportunityNode", "PointEntryNode"]);
        break;
      }
      case CommitteeIdentifier.fundraisingCommittee: {
        allow(Action.Manage, [
          "FundraisingEntryNode",
          "DailyDepartmentNotificationNode",
          "SolicitationCodeNode",
          "FundraisingAssignmentNode",
        ]);
        break;
      }
    }
  }

  if (authenticatedUser) {
    allow(Action.Read, "PersonNode", {
      id: {
        $eq: authenticatedUser.id.id,
      },
    });
    allow(Action.Read, "FundraisingAssignmentNode", {
      ownedByUserIds: [authenticatedUser.id.id],
    });
  }

  const authTeamMemberships = teamMemberships.map(
    (membership) => membership.teamId
  );
  if (authTeamMemberships.length > 0) {
    allow(Action.Read, "TeamNode", {
      id: { $in: authTeamMemberships },
    });
    allow(Action.Read, "MembershipNode", {
      childOfType: "TeamNode",
      childOfId: { $in: authTeamMemberships },
    });
  }

  allow(Action.Read, "TeamNode", ["child"]);

  const authTeamCaptaincies = teamMemberships
    .filter(
      (membership) => membership.position === MembershipPositionType.Captain
    )
    .map((membership) => membership.teamId);
  if (authTeamCaptaincies.length > 0) {
    allow(Action.Read, "PersonNode", {
      withinTeamIds: { $in: authTeamCaptaincies },
    });
    allow([Action.Modify, Action.Create], "FundraisingAssignmentNode", {
      withinTeamIds: { $in: authTeamCaptaincies },
    });
    allow(Action.Read, "FundraisingEntryNode", {
      childOfType: "TeamNode",
      childOfId: { $in: authTeamCaptaincies },
    });
  }

  return doBuild();
}
