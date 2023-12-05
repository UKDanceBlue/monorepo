import { useLoading } from "@context/loading";
import { useInvalidateCache } from "@context/urql";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthSource } from "@ukdanceblue/common";
import { createURL } from "expo-linking";
import { dismissAuthSession, openAuthSessionAsync } from "expo-web-browser";

import { API_BASE_URL } from "./apiUrl";

export const DANCEBLUE_TOKEN_KEY = "danceblue-auth-token";

function getLoginUrl(source: AuthSource): string {
  let urlComponent = "";
  switch (source) {
    case AuthSource.UkyLinkblue: {
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
  console.log("urlString", urlString);
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
      const result = await openAuthSessionAsync(getLoginUrl(source));
      if (result.type === "success") {
        const url = new URL(result.url);
        const token = url.searchParams.get("token");
        console.log("token", token);
        if (token) {
          await AsyncStorage.setItem(DANCEBLUE_TOKEN_KEY, token);
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
