import type {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
  OnErrorResponse,
} from "@refinedev/core";

import { API_BASE_URL, urqlClient } from "#config/api.ts";
import { getLoginState, refreshLoginState } from "#hooks/useLoginState.ts";

function openAuthPopup(
  path: "login" | "logout",
  formValues: Record<string, string> | undefined
): Promise<string> {
  return new Promise((resolve, _reject) => {
    let target: string | undefined =
      `popup_${Math.random().toString(36).substring(2, 9)}`;
    const popup = window.open(
      "",
      target,
      "width=600,height=600,menubar=no,toolbar=no"
    );
    if (popup) {
      setInterval(() => {
        if (popup.closed) {
          resolve("success");
        }
      }, 100);
    } else {
      target = undefined;
    }
    const form = document.createElement("form");
    if (target) form.target = target;
    form.method = "POST";
    form.style.visibility = "hidden";
    form.action = `${API_BASE_URL}/api/auth/${path}?returning=cookie&redirectTo=${encodeURI(
      API_BASE_URL
    )}/_close`;
    for (const [key, value] of Object.entries(formValues ?? {})) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
  });
}

export const authProvider: AuthProvider = {
  // required methods
  login: async ({
    email,
    password,
    providerName,
  }): Promise<AuthActionResponse> => {
    try {
      const result = await openAuthPopup(
        "login",
        providerName === "Linkblue" ? {} : { email, password }
      );
      const loginState = await refreshLoginState(urqlClient);
      return {
        success: result === "success" && loginState.isOk(),
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  },
  check: (): Promise<CheckResponse> => {
    const loginState = getLoginState(urqlClient)
      .map((loginState) => ({ authenticated: loginState.loggedIn ?? false }))
      .mapErr((error) => ({ error, authenticated: false }));

    return Promise.resolve(
      loginState.isOk() ? loginState.value : loginState.error
    );
  },
  logout: async (): Promise<AuthActionResponse> => {
    try {
      const result = await openAuthPopup("logout", undefined);
      const loginState = await refreshLoginState(urqlClient);
      return {
        success: result === "success" && loginState.isOk(),
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
        redirectTo: "/",
      };
    }
  },
  onError: (error): Promise<OnErrorResponse> => {
    return Promise.resolve({ error });
  },
  // optional methods
  // getPermissions: async (params: any): unknown => {},
  // getIdentity: async (params: any): unknown => {},
};
