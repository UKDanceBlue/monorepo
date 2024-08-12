import { API_BASE_URL } from "./apiUrl";
import { Logger } from "./logger/Logger";

import { useLoading } from "@context/loading";
import { useInvalidateCache } from "@context/urql";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthSource } from "@ukdanceblue/common";
import { createURL } from "expo-linking";
import {
  WebBrowserResultType,
  dismissAuthSession,
  openAuthSessionAsync,
} from "expo-web-browser";


export const DANCEBLUE_TOKEN_KEY = "danceblue-auth-token";

function getLoginUrl(source: AuthSource): string {
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
  const urlString = `${API_BASE_URL}/api/auth/${urlComponent}?returning=token&redirectTo=${encodeURIComponent(
    createURL("/auth/login")
  )}`;
  return urlString;
}

export const useLogin = (): [boolean, (source: AuthSource) => void] => {
  const [loading, setLoading] = useLoading("useLinkBlueLogin");
  const invalidateCache = useInvalidateCache();

  const trigger = async (source: AuthSource) => {
    if (loading) {
      dismissAuthSession();
    }
    setLoading(true);
    try {
      const result = await openAuthSessionAsync(
        getLoginUrl(source),
        createURL("/auth/login")
      );
      switch (result.type) {
        case "success": {
          const url = new URL(result.url);
          const token = url.searchParams.get("token");
          if (token) {
            await AsyncStorage.setItem(DANCEBLUE_TOKEN_KEY, token);
          }
          break;
        }
        case WebBrowserResultType.CANCEL: {
          Logger.debug("Auth session was cancelled", {
            context: { result },
          });
          break;
        }
        default: {
          Logger.warn("Auth session was not successful", {
            context: { result },
          });
        }
      }
      invalidateCache();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, trigger];
};

export const useLogOut = (): [boolean, () => void] => {
  const [loading, setLoading] = useLoading("useLogOut");
  const invalidateCache = useInvalidateCache();

  const trigger = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(DANCEBLUE_TOKEN_KEY);
      invalidateCache();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, trigger];
};
