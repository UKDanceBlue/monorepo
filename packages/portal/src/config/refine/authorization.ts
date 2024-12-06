import type { AccessControlProvider } from "@refinedev/core";
import { Action } from "@ukdanceblue/common";

import { urqlClient } from "#config/api.ts";
import { getLoginState } from "#hooks/useLoginState.ts";

export const accessControlProvider: AccessControlProvider = {
  can: ({ action, params }) => {
    const { ability } = getLoginState(urqlClient);

    return Promise.resolve({
      can: ability.can(
        action === "create"
          ? "create"
          : action === "edit"
            ? "update"
            : action === "show"
              ? "read"
              : action === "list"
                ? "read"
                : "manage",
        params?.resource?.meta?.modelName
          ? {
              id: params.id ? String(params.id) : undefined,
              kind: params.resource.meta
                .modelName as "FundraisingAssignmentNode",
              ownedByUserIds: [],
              withinTeamIds: [],
            }
          : "all"
      ),
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
