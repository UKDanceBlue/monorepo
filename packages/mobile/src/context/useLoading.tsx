import { useId, useContext, useCallback } from "react";
import { LoadingContext } from "./loading";

/**
 * For local purposes this is identical to useState<boolean>(false), but it also sets the loading state in the global LoadingContext.
 * @returns A two element array. The first element is whether this loading hook is set to true, and the second is a function to change that value.
 */

export const useLoading = (
  id?: string
): [boolean, (state: boolean) => void, Partial<Record<string, boolean>>] => {
  const randomId = useId();
  const loadingId = id ?? randomId;

  const [loadingReasons, setLoadingForId] = useContext(LoadingContext);

  const isLoading = loadingReasons[loadingId] ?? false;
  const setIsLoading = useCallback(
    (state: boolean) => {
      // This will eventually be used to allow for making the spinner block all input behind it
      // Maybe use an object rather than an array to make it more readable, or a string? dunno
      setLoadingForId(state, loadingId);
    },
    [loadingId, setLoadingForId]
  );

  return [isLoading, setIsLoading, loadingReasons];
};
