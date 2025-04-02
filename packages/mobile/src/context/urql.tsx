import AsyncStorage from "@react-native-async-storage/async-storage";
import { authExchange } from "@urql/exchange-auth";
import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Client, fetchExchange, Provider } from "urql";

import { API_BASE_URL } from "@/common/apiUrl";
import { Logger } from "@/common/logger/Logger";
import { DANCEBLUE_TOKEN_KEY } from "@/common/storage-tokens";

const urqlContext = createContext<{
  invalidate: () => void;
  setMasquerade: (masquerade: string | null) => void;
}>({
  invalidate: () => undefined,
  setMasquerade: () => undefined,
});

export function UrqlContext({ children }: { children: ReactNode }) {
  const [cacheInvalidation, invalidate] = useReducer(
    (state: number) => state + 1,
    1
  );

  const [masquerade, setMasquerade] = useState<string | null>(null);

  const client = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    cacheInvalidation;
    return new Client({
      url: `${API_BASE_URL}/graphql`,
      exchanges: [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        authExchange(async ({ appendHeaders }) => {
          const token = await AsyncStorage.getItem(DANCEBLUE_TOKEN_KEY);

          return {
            addAuthToOperation: (operation) => {
              if (token) {
                return appendHeaders(operation, {
                  Authorization: `Bearer ${token}`,
                  ...(masquerade ? { "x-ukdb-masquerade": masquerade } : {}),
                });
              }
              return operation;
            },
            refreshAuth: async () => {
              await AsyncStorage.removeItem(DANCEBLUE_TOKEN_KEY);
              invalidate();
            },
            didAuthError: (args) => {
              const { message, response, graphQLErrors } = args;

              if (
                message === "Context creation failed: Invalid JWT payload" ||
                message ===
                  "[GraphQL] Context creation failed: invalid signature" ||
                graphQLErrors.some(
                  (error) => error.extensions.code === "UNAUTHENTICATED"
                )
              ) {
                Logger.info("Auth error", {
                  context: {
                    message,
                    response: {
                      status: (response as { status?: unknown }).status,
                    },
                  },
                });
              } else if (
                (response as { status?: unknown } | undefined)?.status ===
                  401 ||
                message ===
                  "Access denied! You don't have permission for this action!" ||
                graphQLErrors.some(
                  (error) => error.extensions.code === "UNAUTHORIZED"
                )
              ) {
                Logger.info("Auth error", {
                  context: {
                    message,
                    response: {
                      status: (response as { status?: unknown }).status,
                    },
                  },
                });
              }

              return false;
            },
          };
        }),
        fetchExchange,
      ],
    });
  }, [cacheInvalidation, masquerade]);

  return (
    <urqlContext.Provider
      value={{
        invalidate,
        setMasquerade,
      }}
    >
      <Provider value={client}>{children}</Provider>
    </urqlContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUrqlConfig() {
  return useContext(urqlContext);
}
