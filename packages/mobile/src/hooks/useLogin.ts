import { AuthSource } from "@ukdanceblue/common";
import { createURL } from "expo-linking";
import {
  dismissAuthSession,
  openAuthSessionAsync,
  WebBrowserResultType,
} from "expo-web-browser";

import { useAuthContext } from "@/components/auth/AuthContext";
import { useLoading } from "@/components/loading/loadingContext";
import { API_BASE_URL } from "@/util/apiUrl";
import { Logger } from "@/util/logger/Logger";

function getLoginUrl(source: AuthSource): [string, string] {
  let urlComponent = "";
  switch (source) {
    case AuthSource.LinkBlue: {
      urlComponent = "login";
      break;
    }
    case AuthSource.Anonymous: {
      urlComponent = "anonymous";
      break;
    }
    case AuthSource.Demo: {
      urlComponent = "demo";
      break;
    }
    default: {
      throw new Error(`Unknown auth source: ${source}`);
    }
  }

  const redirectUrl = createURL("/auth/login");
  const urlString = `${API_BASE_URL}/api/auth/${urlComponent}?returning=token&redirectTo=${encodeURIComponent(
    redirectUrl
  )}`;
  return [urlString, redirectUrl];
}

export const useLogin = (): [boolean, (source: AuthSource) => void] => {
  const [loading, setLoading] = useLoading("useLinkBlueLogin", 10_000);

  const { setToken } = useAuthContext();

  const trigger = async (source: AuthSource) => {
    if (loading) {
      dismissAuthSession();
    }
    setLoading(true);
    try {
      const result = await openAuthSessionAsync(...getLoginUrl(source));
      Logger.debug("Auth session result", { context: { result } });
      switch (result.type) {
        case "success": {
          const url = new URL(result.url);
          const token = url.searchParams.get("token");
          if (token) {
            setToken(token);
          }
          break;
        }
        case WebBrowserResultType.DISMISS:
        case WebBrowserResultType.OPENED:
        case WebBrowserResultType.LOCKED:
        case WebBrowserResultType.CANCEL: {
          Logger.debug("Auth session was cancelled", {
            context: { result },
          });
          break;
        }
        default: {
          result satisfies never;
        }
      }
    } catch (error) {
      Logger.error("Error logging in", { error });
    } finally {
      setLoading(false);
    }
  };

  return [loading, trigger];
};

export const useLogOut = (): [boolean, () => void] => {
  const [loading, setLoading] = useLoading("useLogOut", 10_000);

  const { setToken } = useAuthContext();

  const trigger = () => {
    setLoading(true);
    try {
      setToken(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, trigger];
};
