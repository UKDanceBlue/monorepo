import { Logger } from "@common/logger/Logger";
import { AuthSource } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-mobile";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useQuery } from "urql";

export interface AuthState {
  personUuid: string | null;
  loggedIn: boolean;
  authSource: AuthSource;

  ready: boolean;
}

const authStateContext = createContext<AuthState>({
  personUuid: null,
  loggedIn: false,
  authSource: AuthSource.None,

  ready: false,
});

const authStateDocument = graphql(/* GraphQL */ `
  query AuthState {
    me {
      id
    }
    loginState {
      dbRole
      loggedIn
      authSource
    }
  }
`);

export function AuthStateProvider({ children }: { children: ReactNode }) {
  const [{ fetching, error, data }] = useQuery({
    query: authStateDocument,
  });

  useEffect(() => {
    if (error) {
      Logger.error("Error fetching auth state", { error });
    }
  }, [error]);

  useEffect(() => {
    if (!fetching && !error) {
      Logger.debug("Auth state fetched", {
        context: {
          loggedIn: data?.loginState.loggedIn,
          authSource: data?.loginState.authSource,
          role: data?.loginState.dbRole,
          userUuid: data?.me?.id,
        },
        tags: ["graphql"],
      });
    }
  }, [fetching, error, data]);

  return (
    <authStateContext.Provider
      value={{
        personUuid: data?.me?.id ?? null,
        loggedIn: data?.loginState.loggedIn ?? false,
        authSource: data?.loginState.authSource ?? AuthSource.None,

        ready: !fetching && !error,
      }}
    >
      {children}
    </authStateContext.Provider>
  );
}

export function useAuthState() {
  return useContext(authStateContext);
}
