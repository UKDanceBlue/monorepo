import { authExchange } from "@urql/exchange-auth";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Client, fetchExchange, Provider } from "urql";

import { API_BASE_URL } from "~/api/apiUrl";
import { useAuthContext } from "~/auth/context/AuthContext";
import { Logger } from "~/lib/logger/Logger";

export function UrqlContext({ children }: { children: ReactNode }) {
  const { token, setToken, masquerade } = useAuthContext();

  const client = useMemo(() => {
    return new Client({
      url: `${API_BASE_URL}/graphql`,
      exchanges: [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        authExchange(({ appendHeaders }) =>
          Promise.resolve({
            addAuthToOperation: (operation) => {
              if (token) {
                return appendHeaders(operation, {
                  Authorization: `Bearer ${token}`,
                  ...(masquerade ? { "x-ukdb-masquerade": masquerade } : {}),
                });
              }
              return operation;
            },
            refreshAuth: () => {
              setToken(null);
              return Promise.resolve();
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
                setToken(null);
                return true;
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
                return true;
              }

              return false;
            },
          })
        ),
        fetchExchange,
      ],
    });
  }, [masquerade, setToken, token]);

  return <Provider value={client}>{children}</Provider>;
}
