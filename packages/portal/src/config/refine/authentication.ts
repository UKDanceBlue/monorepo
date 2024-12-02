import type {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
  OnErrorResponse,
} from "@refinedev/core";

import { API_BASE_URL, urqlClient } from "#config/api.ts";
import { refreshLoginState } from "#hooks/useLoginState.ts";

function openAuthPopup(path: "login" | "logout"): Promise<string> {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      `${API_BASE_URL}/api/auth/${path}?returning=cookie&redirectTo=${encodeURI(
        new URL("#popup", window.location.origin).href
      )}`,
      undefined,
      "popup"
    );
    if (!popup) {
      reject(new Error("Failed to open popup"));
      return;
    }

    addEventListener("message", (event) => {
      console.log(event);
      if (event.origin === window.location.origin) {
        resolve(String(event.data));
        popup.close();
      }
    });
    popup.addEventListener("error", (event) => {
      reject(new Error(event.message));
      popup.close();
    });
    popup.addEventListener("beforeunload", () => {
      reject(new Error("User closed the popup"));
    });
  });
}

export const authProvider: AuthProvider = {
  // required methods
  login: async (): Promise<AuthActionResponse> => {
    try {
      const result = await openAuthPopup("login");
      await refreshLoginState(urqlClient);
      return {
        success: result === "success",
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      };
    }
  },
  check: async (): Promise<CheckResponse> => {
    const { loggedIn } = await refreshLoginState(urqlClient);

    return { authenticated: loggedIn ?? false };
  },
  logout: async (): Promise<AuthActionResponse> => {
    try {
      const result = await openAuthPopup("logout");
      await refreshLoginState(urqlClient);
      return {
        success: result === "success",
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
