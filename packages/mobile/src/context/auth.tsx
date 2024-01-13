import { Logger } from "@common/logger/Logger";
import { AuthSource, RoleResource, defaultRole } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useQuery } from "urql";

export interface AuthState {
  personUuid: string | null;
  loggedIn: boolean;
  role: RoleResource;
  authSource: AuthSource;

  ready: boolean;
}

const authStateContext = createContext<AuthState>({
  personUuid: null,
  loggedIn: false,
  role: defaultRole,
  authSource: AuthSource.None,

  ready: false,
});

const authStateDocument = graphql(/* GraphQL */ `
  query AuthState {
    me {
      data {
        uuid
      }
    }
    loginState {
      role {
        dbRole
        committeeIdentifier
        committeeRole
      }
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

  return (
    <authStateContext.Provider
      value={{
        personUuid: data?.me.data?.uuid ?? null,
        loggedIn: data?.loginState.loggedIn ?? false,
        role: data?.loginState.role
          ? RoleResource.init(data.loginState.role)
          : defaultRole,
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
