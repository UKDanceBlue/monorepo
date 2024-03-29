import { API_BASE_URL } from "@common/apiUrl";
import { DANCEBLUE_TOKEN_KEY } from "@common/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorCode } from "@ukdanceblue/common";
import { authExchange } from "@urql/exchange-auth";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useReducer } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

const invalidateCacheContext = createContext<() => void>(() => {});

export function UrqlContext({ children }: { children: ReactNode }) {
  const [cacheInvalidation, invalidateCache] = useReducer(
    (state: number) => state + 1,
    1
  );

  const client = useMemo(() => {
    cacheInvalidation;
    return new Client({
      url: `${API_BASE_URL}/graphql`,
      exchanges: [
        cacheExchange,
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
            didAuthError: ({ message, graphQLErrors }) => {
              for (const err of graphQLErrors) {
                if (err.extensions.code === ErrorCode.NotLoggedIn) {
                  return true;
                }
              }

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

export function useInvalidateCache() {
  return useContext(invalidateCacheContext);
}
