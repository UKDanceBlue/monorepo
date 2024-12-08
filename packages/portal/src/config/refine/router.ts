import {
  type Action,
  type GoConfig,
  type IResourceItem,
  type ParseFunction,
} from "@refinedev/core";
import {
  Link,
  useLocation,
  useMatches,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";

import { findResourceAction } from "./resources";

function useRefineGoFunction() {
  const navigate = useNavigate();
  const location = useLocation();

  const go = useCallback(
    ({ hash, options, query, to, type }: GoConfig) => {
      navigate({
        to,
        search: options?.keepQuery ? location.search : query,
        hash: options?.keepHash ? location.hash : hash,
        replace: type === "replace",
      }).catch(console.error);
    },
    [location.search, location.hash, navigate]
  );

  useEffect(() => {
    console.log("location updated to", location.search, location.hash);
  }, [location.search, location.hash]);

  useEffect(() => {
    console.log("navigate updated");
  }, [navigate]);

  useEffect(() => {
    console.log("go updated");
  }, [go]);

  return go;
}
function useRefineParseFunction(): ParseFunction {
  const matches = useMatches();
  const location = useLocation();

  const parsed = useMemo(() => {
    const matchesByLength = matches.toSorted(
      ({ fullPath: fullPathA }, { fullPath: fullPathB }) =>
        String(fullPathB).length - String(fullPathA).length
    );
    const longestMatch = matchesByLength[0];

    let action: Action | undefined;
    let resource: IResourceItem | undefined;
    let id: string | undefined;
    if (longestMatch) {
      const idParams = Object.keys(longestMatch.params as object).filter(
        (key) => key.toLowerCase().endsWith("id")
      );
      if (idParams.length === 1) {
        id = (longestMatch.params as Record<string, string | undefined>)[
          idParams[0]!
        ];
      }
      ({ action, resource } = findResourceAction(
        String(longestMatch.fullPath)
      ));
    }

    return {
      pathname: location.pathname,
      params: longestMatch?.params,
      id,
      action,
      resource,
    };
  }, [location.pathname, matches]);

  useEffect(() => {
    console.log("location updated to", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log("matches updated");
  }, [matches]);

  return () => parsed;
}

function useRefineBackFunction() {
  const router = useRouter();

  const back = useCallback(() => router.history.back(), [router.history.back]);

  useEffect(() => {
    console.log("back updated");
  }, [back]);

  return back;
}

export const refineRouterProvider = {
  back: useRefineBackFunction,
  Link,
  go: useRefineGoFunction,
  parse: useRefineParseFunction,
};
