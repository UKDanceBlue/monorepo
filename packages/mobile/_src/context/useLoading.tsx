import { createContext, useCallback, useContext, useId, useState } from "react";

import { useTimeout } from "@/common/hooks/useTimeout";
import { Logger } from "@/common/logger/Logger";

export const LoadingContext = createContext<
  [Partial<Record<string, boolean>>, (state: boolean, id: string) => void]
>([{}, () => undefined]);

/**
 * For local purposes this is identical to useState<boolean>(false), but it also sets the loading state in the global LoadingContext.
 * @returns A two element array. The first element is whether this loading hook is set to true, and the second is a function to change that value.
 */

export const useLoading = (
  id?: string,
  timeout?: number
): [
  boolean,
  (state: boolean) => void,
  Partial<Record<string, boolean>>,
  boolean,
] => {
  const randomId = useId();
  const loadingId = id ?? randomId;

  const [timedOut, setTimedOut] = useState(false);

  const [startTimeout, cancelTimeout] = useTimeout(
    useCallback(() => {
      if (timeout) {
        setTimedOut(true);
        Logger.debug(`Loading timed out for ${loadingId}`, {
          source: "useLoading",
        });
      }
    }, [loadingId, timeout])
  );

  const [loadingReasons, setLoadingForId] = useContext(LoadingContext);

  const isLoading = loadingReasons[loadingId] ?? false;
  const setIsLoading = useCallback(
    (state: boolean) => {
      // This will eventually be used to allow for making the spinner block all input behind it
      // Maybe use an object rather than an array to make it more readable, or a string? dunno
      setLoadingForId(state, loadingId);
      setTimedOut(false);

      if (timeout) {
        if (state) {
          startTimeout(timeout);
        } else {
          cancelTimeout();
        }
      }

      Logger.debug(`Setting loading for ${loadingId} to ${state}`, {
        source: "useLoading",
      });
    },
    [cancelTimeout, loadingId, setLoadingForId, startTimeout, timeout]
  );

  return [!timedOut && isLoading, setIsLoading, loadingReasons, timedOut];
};
