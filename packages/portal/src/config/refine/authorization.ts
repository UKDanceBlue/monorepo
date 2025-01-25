import type { AccessControlProvider, CanParams } from "@refinedev/core";
import type { Action } from "@ukdanceblue/common";

import { type PortalAuthData } from "#hooks/useLoginState.ts";

export function getAccessControlProvider(
  loginState: PortalAuthData
): AccessControlProvider {
  return {
    can: (param) => {
      return Promise.resolve(canSync(param, loginState));
    },
    options: {
      buttons: {
        enableAccessControl: true,
        hideIfUnauthorized: true,
      },
    },
  };
}

export function canSync(
  { action, params }: CanParams,
  loginState: PortalAuthData
) {
  const caslAction =
    action === "clone"
      ? "create"
      : action === "edit"
        ? "update"
        : action === "show"
          ? "get"
          : (action as Action);

  const caslSubject = params?.resource?.meta?.modelName
    ? params.id
      ? {
          id: params.id ? String(params.id) : undefined,
          kind: params.resource.meta.modelName as "FundraisingAssignmentNode",
        }
      : (params.resource.meta.modelName as "FundraisingAssignmentNode")
    : "all";

  return {
    can: loginState.ability.can(
      caslAction,
      caslSubject,
      params?.field ? String(params.field) : "."
    ),
    reason: `You are not authorized to ${caslAction} ${typeof caslSubject === "string" ? caslSubject : `${caslSubject.kind}[ID=${caslSubject.id}]`}`,
  };
}
