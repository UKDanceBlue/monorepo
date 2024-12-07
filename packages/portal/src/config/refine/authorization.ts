import type { AccessControlProvider } from "@refinedev/core";
import type { Action } from "@ukdanceblue/common";

import { urqlClient } from "#config/api.ts";
import { getLoginState } from "#hooks/useLoginState.ts";

export const accessControlProvider: AccessControlProvider = {
  can: ({ action, params }) => {
    const loginState = getLoginState(urqlClient);

    if (loginState.isErr()) {
      return Promise.resolve({ can: false });
    }

    return Promise.resolve({
      can: loginState.value.ability.can(
        action === "clone"
          ? "create"
          : action === "edit"
            ? "update"
            : action === "show"
              ? "get"
              : (action as Action),
        params?.resource?.meta?.modelName
          ? {
              id: params.id ? String(params.id) : undefined,
              kind: params.resource.meta
                .modelName as "FundraisingAssignmentNode",
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
