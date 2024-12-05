import type { InferSubjects, MongoAbility } from "@casl/ability";
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
} from "@ukdanceblue/common";

type ResourceSubject = {
  [resource in keyof typeof ResourceClasses]: {
    kind: resource;
    id?: string;
    parentType?: string;
    parentID?: string;
  };
};

type SubjectValue = ResourceSubject[keyof ResourceSubject];
type Subject = InferSubjects<SubjectValue, true>;

export const Action = {
  Create: "create",
  Read: "read",
  Update: "update",
  Delete: "delete",
  Deploy: "deploy",
  Modify: "modify",
  Manage: "manage",
} as const;
export type Action = (typeof Action)[keyof typeof Action];

const resolveAction = createAliasResolver({
  modify: ["read", "update", "delete"],
});

export type AppAbility = MongoAbility<
  | [
      (
        | typeof Action.Create
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

export interface AuthParam extends Authorization {
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
    cannot: forbid,
    build,
  } = new AbilityBuilder<AppAbility>(createMongoAbility);

  function doBuild() {
    return build({
      resolveAction,
    });
  }

  switch (accessLevel) {
    case AccessLevel.SuperAdmin: {
      allow(Action.Manage, "all");
      return doBuild();
    }
    case AccessLevel.None: {
      return doBuild();
    }
    case AccessLevel.Admin: {
      allow(Action.Manage, [
        "ConfigurationNode",
        "MarathonNode",
        "MarathonHourNode",
        "FundraisingAssignmentNode",
        "FundraisingEntryNode",
      ]);
      // fallthrough
    }
    case AccessLevel.CommitteeChairOrCoordinator: {
      allow(Action.Manage, [
        "CommitteeNode",
        "ConfigurationNode",
        "DeviceNode",
        "EventNode",
        "FeedNode",
        "ImageNode",
        "MembershipNode",
        "NotificationDeliveryNode",
        "NotificationNode",
        "PersonNode",
      ]);
      // fallthrough
    }
    case AccessLevel.Committee: {
      allow(Action.Read, ["TeamNode", "SolicitationCodeNode"]);
      // fallthrough
    }
    case AccessLevel.UKY:
    case AccessLevel.Public: {
      allow(Action.Read, [
        "CommitteeNode",
        "ConfigurationNode",
        "EventNode",
        "FeedNode",
        "ImageNode",
        "TeamNode",
      ]);
    }
  }

  for (const { identifier, role } of effectiveCommitteeRoles) {
    switch (identifier) {
      case CommitteeIdentifier.viceCommittee: {
        allow(role === CommitteeRole.Member ? Action.Modify : Action.Manage, [
          "PersonNode",
        ]);
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
      id: authenticatedUser.id.id,
    });
  }
  for (const { teamId, teamType, position } of teamMemberships) {
    allow(Action.Read, "TeamNode", {
      id: teamId,
    });
  }

  return doBuild();
}
