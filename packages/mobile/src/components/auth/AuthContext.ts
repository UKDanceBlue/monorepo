import { createContext, useContext } from "react";

export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  masquerade: string | null;
  setMasquerade: (masquerade: string | null) => void;
}

export const authContext = createContext<AuthContextType>({
  token: null,
  setToken: () => undefined,
  masquerade: null,
  setMasquerade: () => undefined,
});

export function useAuthContext() {
  return useContext(authContext);
}
