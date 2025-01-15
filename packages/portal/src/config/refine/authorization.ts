import type { AccessControlProvider, CanParams } from "@refinedev/core";
import type { Action } from "@ukdanceblue/common";

import { urqlClient } from "#config/api.ts";
import type { PortalAuthData } from "#hooks/useLoginState.ts";
import { getLoginState } from "#hooks/useLoginState.ts";

export const accessControlProvider: AccessControlProvider = {
  // eslint-disable-next-line @typescript-eslint/require-await
  can: async (param) => {
    const loginState = getLoginState(urqlClient);

    if (loginState.isErr()) {
      return { can: false };
    }

    return {
      can: canSync(param, loginState.value),
    };
  },
  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: false,
    },
  },
};

export function canSync(
  { action, params }: CanParams,
  loginState: PortalAuthData
): boolean {
  const ok = loginState.ability.can(
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
          kind: params.resource.meta.modelName as "FundraisingAssignmentNode",
        }
      : "all"
  );

  return ok;
}
