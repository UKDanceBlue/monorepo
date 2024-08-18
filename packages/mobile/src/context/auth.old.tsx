interface UnloadedAuthData {
  isAuthLoaded: false;
  isLoggedIn: false;
  isAnonymous: false;
  uid: null;
  authClaims: null;
}

interface LoadedAuthData {
  isAuthLoaded: true;
  isLoggedIn: boolean;
  isAnonymous: boolean;
  uid: string | null;
  authClaims: Record<string, string | object> | null;
}

type AuthData = UnloadedAuthData | LoadedAuthData;

/** @deprecated */
export const useAuthData = (): AuthData => {
  return {
    authClaims: null,
    isAnonymous: false,
    isAuthLoaded: true,
    isLoggedIn: false,
    uid: null,
  };
};
