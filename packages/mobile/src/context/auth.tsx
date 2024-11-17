import type { ReactNode } from "react";
export interface AuthState {
  personUuid: string | null;
  loggedIn: boolean;

  ready: boolean;
}

export function AuthStateProvider({ children }: { children: ReactNode }) {
  return children;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthState() {
  return {
    personUuid: "",
    loggedIn: false,
    ready: false,
  };
}
