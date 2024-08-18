import { Center, Spinner, ZStack } from "native-base";
import type { ReactNode } from "react";
import { createContext, useCallback, useReducer } from "react";

export const LoadingContext = createContext<
  [Partial<Record<string, boolean>>, (state: boolean, id: string) => void]
>([{}, () => undefined]);

/**
 * Provides a loading context for the app, accessed via the useLoading hook. If any loading state is true, a spinner will be displayed.
 * @param params
 * @param params.children The app's content
 * @returns The app's content wrapped in a loading context
 */
export const LoadingWrapper = ({ children }: { children: ReactNode }) => {
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
    <LoadingContext.Provider value={[loadingReasons, setLoading]}>
      <ZStack>
        {children}
        {Object.values(loadingReasons).some(Boolean) && (
          <Center width="full" height="full">
            <Spinner size="lg" color="#0000ff" />
          </Center>
        )}
      </ZStack>
    </LoadingContext.Provider>
  );
};
