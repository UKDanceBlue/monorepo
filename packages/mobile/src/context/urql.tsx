import AsyncStorage from "@react-native-async-storage/async-storage";
import { authExchange } from "@urql/exchange-auth";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useReducer } from "react";
import { cacheExchange, Client, fetchExchange, Provider } from "urql";

import { API_BASE_URL } from "#common/apiUrl.js";
import { DANCEBLUE_TOKEN_KEY } from "#common/auth.js";

const invalidateCacheContext = createContext<() => void>(() => undefined);

export function UrqlContext({ children }: { children: ReactNode }) {
  const [cacheInvalidation, invalidateCache] = useReducer(
    (state: number) => state + 1,
    1
  );

  const client = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    cacheInvalidation;
    return new Client({
      url: `${API_BASE_URL}/graphql`,
      exchanges: [
        cacheExchange,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        authExchange(async ({ appendHeaders }) => {
          const token = await AsyncStorage.getItem(DANCEBLUE_TOKEN_KEY);

          return {
            addAuthToOperation: (operation) => {
              if (token) {
                return appendHeaders(operation, {
                  Authorization: `Bearer ${token}`,
                });
              }
              return operation;
            },
            refreshAuth: async () => {
              await AsyncStorage.removeItem(DANCEBLUE_TOKEN_KEY);
              invalidateCache();
            },
            didAuthError: ({ message }) => {
              // for (const err of graphQLErrors) {
              //   if (err.extensions.code === LegacyErrorCode.NotLoggedIn) {
              //     return true;
              //   }
              // }

              return (
                message ===
                  "Access denied! You don't have permission for this action!" ||
                message === "Context creation failed: Invalid JWT payload" ||
                message ===
                  "[GraphQL] Context creation failed: invalid signature"
              );
            },
          };
        }),
        fetchExchange,
      ],
    });
  }, [cacheInvalidation]);

  return (
    <invalidateCacheContext.Provider value={invalidateCache}>
      <Provider value={client}>{children}</Provider>
    </invalidateCacheContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInvalidateCache() {
  return useContext(invalidateCacheContext);
}
