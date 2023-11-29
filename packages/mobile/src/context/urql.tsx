import { authExchange } from "@urql/exchange-auth";
import Constants from "expo-constants";
import type { ReactNode, RefObject } from "react";
import { useMemo } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

let url = "https://app.danceblue.org/graphql";
if (process.env.NODE_ENV === "development") {
  const developmentUrl = Constants.expoGoConfig?.debuggerHost
    ?.split(":")
    .shift();
  url = developmentUrl
    ? `http://${developmentUrl}:8000/graphql`
    : "http://localhost:8000/graphql";
}

export function UrqlContext({
  children,
  refreshAuthRef,
  tokenRef,
}: {
  children: ReactNode;
  refreshAuthRef: RefObject<() => Promise<void>>;
  tokenRef: RefObject<string | undefined>;
}) {
  const client = useMemo(
    () =>
      new Client({
        url,
        exchanges: [
          cacheExchange,
          fetchExchange,
          authExchange(({ appendHeaders }) => {
            return Promise.resolve({
              addAuthToOperation: (operation) => {
                if (tokenRef.current) {
                  return appendHeaders(operation, {
                    Authorization: `Bearer ${tokenRef.current}`,
                  });
                }
                return operation;
              },
              refreshAuth: async () => {
                await refreshAuthRef.current?.();
              },
              didAuthError: ({ message }) => {
                return (
                  message ===
                  "Access denied! You don't have permission for this action!"
                );
              },
            });
          }),
        ],
      }),
    [refreshAuthRef, tokenRef]
  );
  client;
  return <Provider value={client}>{children}</Provider>;
}
