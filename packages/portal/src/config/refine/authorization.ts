import type { AccessControlProvider } from "@refinedev/core";
import { Action } from "@ukdanceblue/common";

import { useAuthorizationRequirement } from "#hooks/useLoginState.ts";

export const accessControlProvider: AccessControlProvider = {
  can: ({ action, params }) => {
    return Promise.resolve({
      // @ts-expect-error TODO: Fix this
      can: useAuthorizationRequirement([
        action === "create"
          ? Action.Create
          : action === "edit"
            ? Action.Update
            : action === "show"
              ? Action.Read
              : action === "list"
                ? Action.Read
                : Action.Manage,
        params?.resource?.meta?.nodeName
          ? {
              id: params.id ? String(params.id) : undefined,
              kind: params.resource.meta
                .nodeName as "FundraisingAssignmentNode",
              ownedByUserIds: [],
              withinTeamIds: [],
            }
          : "all",
      ]),
    });
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: false,
    },
    queryOptions: {
      // ... default global query options
    },
  },
};
