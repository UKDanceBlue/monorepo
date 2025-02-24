import {
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  deleteItemAsync,
  getItem,
  type SecureStoreOptions,
  setItem,
} from "expo-secure-store";
import { type PropsWithChildren, useState } from "react";
import { Platform } from "react-native";

import { universalCatch } from "~/lib/logger/Logger";

import { authContext } from "./AuthContext";

const DANCEBLUE_TOKEN_KEY = "danceblue-auth-token";

const SECURE_STORE_OPTIONS: SecureStoreOptions = {
  keychainAccessible: AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState(
    Platform.select({
      web: () => window.localStorage.getItem(DANCEBLUE_TOKEN_KEY),
      default: () => getItem(DANCEBLUE_TOKEN_KEY, SECURE_STORE_OPTIONS) || null,
    })
  );

  const [masquerade, setMasquerade] = useState<string | null>(null);

  return (
    <authContext.Provider
      value={{
        token,
        setToken: Platform.select({
          web: (token) => {
            setToken(token);

            if (token) {
              window.localStorage.setItem(DANCEBLUE_TOKEN_KEY, token);
            } else {
              window.localStorage.removeItem(DANCEBLUE_TOKEN_KEY);
            }
          },
          default: (token) => {
            setToken(token);

            if (token) {
              setItem(DANCEBLUE_TOKEN_KEY, token, SECURE_STORE_OPTIONS);
            } else {
              setItem(DANCEBLUE_TOKEN_KEY, "", SECURE_STORE_OPTIONS);
              deleteItemAsync(DANCEBLUE_TOKEN_KEY, SECURE_STORE_OPTIONS).catch(
                universalCatch
              );
            }
          },
        }),
        masquerade,
        setMasquerade,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
