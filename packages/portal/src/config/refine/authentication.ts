import type {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
  OnErrorResponse,
} from "@refinedev/core";
import { notification } from "antd";

import { API_BASE_URL, urqlClient } from "#config/api.ts";
import { getLoginState, refreshLoginState } from "#hooks/useLoginState.ts";

function openAuthPopup(path: "login" | "logout"): Promise<string> {
  return new Promise((resolve, _reject) => {
    // const popup = window.open(
    //   `${API_BASE_URL}/api/auth/${path}?returning=cookie&redirectTo=${encodeURI(
    //     new URL("assets/popup.html", window.location.origin).href
    //   )}`,
    //   undefined,
    //   "popup"
    // );
    // if (!popup) {
    //   reject(new Error("Failed to open popup"));
    //   return;
    // }

    // addEventListener("message", (event) => {
    //   console.log(event);
    //   if (event.origin === window.location.origin) {
    //     resolve(String(event.data));
    //     popup.close();
    //   }
    // });
    // popup.addEventListener("error", (event) => {
    //   reject(new Error(event.message));
    //   popup.close();
    // });
    // popup.addEventListener("beforeunload", () => {
    //   reject(new Error("User closed the popup"));
    // });
    window.location.href = `${API_BASE_URL}/api/auth/${path}?returning=cookie&redirectTo=${encodeURI(
      window.location.href
    )}`;
    resolve("success");
  });
}

export const authProvider: AuthProvider = {
  // required methods
  login: async (): Promise<AuthActionResponse> => {
    try {
      const result = await openAuthPopup("login");
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
      const result = await openAuthPopup("logout");
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
    notification.error({
      message: String(error),
    });
    return Promise.resolve({ error });
  },
  // optional methods
  // getPermissions: async (params: any): unknown => {},
  // getIdentity: async (params: any): unknown => {},
};
