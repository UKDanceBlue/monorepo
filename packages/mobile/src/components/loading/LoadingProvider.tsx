import type { ReactNode } from "react";
import { useCallback, useReducer } from "react";
import { Animated, Modal } from "react-native";

import LoadingRibbon from "@/svgs/LoadingRibbon";

import { loadingContext } from "./loadingContext";
import { LoadingOverlay } from "./LoadingOverlay";

/**
 * Provides a loading context for the app, accessed via the useLoading hook. If any loading state is true, a spinner will be displayed.
 * @param params
 * @param params.children The app's content
 * @returns The app's content wrapped in a loading context
 */
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loadingReasons, updateLoadingReasons] = useReducer(
    (
      state: Partial<Record<string, boolean>>,
      [id, stateChange]: [string, boolean]
    ) => {
      return {
        ...state,
        [id]: stateChange,
      };
    },
    {}
  );

  const setLoading = useCallback((state: boolean, id: string) => {
    updateLoadingReasons([id, state]);
  }, []);

  return (
    <loadingContext.Provider value={[loadingReasons, setLoading]}>
      <LoadingOverlay
        fullScreen
        isVisible={Object.values(loadingReasons).some(Boolean)}
      >
        {children}
      </LoadingOverlay>
    </loadingContext.Provider>
  );
};
