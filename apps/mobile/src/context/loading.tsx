import { Center, Spinner, ZStack } from "native-base";
import { ReactNode, createContext, useCallback, useContext, useId, useReducer } from "react";

const LoadingContext = createContext<[Partial<Record<string, boolean>>, (state: boolean, id: string) => void]>([ {}, () => undefined ]);

/**
 * Provides a loading context for the app, accessed via the useLoading hook. If any loading state is true, a spinner will be displayed.
 * @param params
 * @param params.children The app's content
 * @returns The app's content wrapped in a loading context
 */
export const LoadingWrapper = ({ children }: { children: ReactNode }) => {
  const [ loadingReasons, updateLoadingReasons ] = useReducer(
    (state: Partial<Record<string, boolean>>, [ id, stateChange ]: [string, boolean]) => {
      return {
        ...state,
        [id]: stateChange,
      };
    },
    {}
  );

  const setLoading = useCallback((state: boolean, id: string) => {
    updateLoadingReasons([ id, state ]);
  }, []);

  return (
    <LoadingContext.Provider value={[ loadingReasons, setLoading ]}>
      <ZStack>
        {children}
        {
          (Object.values(loadingReasons).some((val) => val)) &&
          (
            <Center width="full" height="full">
              <Spinner size="lg" color="#0000ff" />
            </Center>
          )
        }
      </ZStack>
    </LoadingContext.Provider>
  );
};

/**
 * For local purposes this is identical to useState<boolean>(false), but it also sets the loading state in the global LoadingContext.
 * @returns A two element array. The first element is whether this loading hook is set to true, and the second is a function to change that value.
 */
export const useLoading = (id?: string): [boolean, (state: boolean) => void, Partial<Record<string, boolean>>] => {
  const randomId = useId();
  const loadingId = id ?? randomId;

  const [ loadingReasons, setLoadingForId ] = useContext(LoadingContext);

  const isLoading = (loadingReasons[loadingId]) ?? false;
  const setIsLoading = useCallback((state: boolean) => {
    // This will eventually be used to allow for making the spinner block all input behind it
    // Maybe use an object rather than an array to make it more readable, or a string? dunno
    setLoadingForId(state, loadingId);
  }, [ loadingId, setLoadingForId ]);

  return [
    isLoading, setIsLoading, loadingReasons
  ];
};
