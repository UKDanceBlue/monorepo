import { API_BASE_URL } from "@common/apiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authExchange } from "@urql/exchange-auth";
import type { ReactNode, RefObject } from "react";
import { useMemo } from "react";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

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
        url: `${API_BASE_URL}/graphql`,
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
