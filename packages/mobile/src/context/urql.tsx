import AsyncStorage from "@react-native-async-storage/async-storage";
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
}: {
  children: ReactNode;
  refreshAuthRef: RefObject<() => Promise<void>>;
}) {
  const client = useMemo(
    () =>
      new Client({
        url,
        fetch: (...params) => {
          console.log("Fetching", params);
          return fetch(...params);
        },
        exchanges: [
          cacheExchange,
          authExchange(async ({ appendHeaders }) => {
            const token = await AsyncStorage.getItem("danceblue-auth-token");

            return {
              addAuthToOperation: (operation) => {
                console.log(token);
                if (token) {
                  console.log("Adding auth to operation");
                  return appendHeaders(operation, {
                    Authorization: `Bearer ${token}`,
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
            };
          }),
          fetchExchange,
        ],
      }),
    [refreshAuthRef]
  );
  client;
  return <Provider value={client}>{children}</Provider>;
}
