import { useLoading } from "@context/loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createURL } from "expo-linking";
import { dismissAuthSession, openAuthSessionAsync } from "expo-web-browser";

import { API_BASE_URL } from "./apiUrl";

export const DANCEBLUE_TOKEN_KEY = "danceblue-auth-token";

function getLoginUrl(): string {
  return `${API_BASE_URL}/api/auth/login?returning=token&redirectTo=${encodeURIComponent(
    createURL("/auth/login")
  )}`;
}

export const useLinkBlueLogin = (): [boolean, () => void] => {
  const [loading, setLoading] = useLoading("useLinkBlueLogin");

  const trigger = async () => {
    if (loading) {
      dismissAuthSession();
    }
    setLoading(true);
    try {
      const result = await openAuthSessionAsync(getLoginUrl());
      if (result.type === "success") {
        const url = new URL(result.url);
        const token = url.searchParams.get("token");
        if (token) {
          await AsyncStorage.setItem(DANCEBLUE_TOKEN_KEY, token);
        }
      }
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

  const trigger = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem(DANCEBLUE_TOKEN_KEY);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, trigger];
};
