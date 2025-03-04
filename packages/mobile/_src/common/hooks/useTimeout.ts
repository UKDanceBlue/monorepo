import { useCallback, useEffect, useRef } from "react";

export function useTimeout(
  callback: () => void,
  defaultDelay?: number
): [(localDelay?: number) => void, () => void] {
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
  }, []);

  const start = useCallback(
    (localDelay?: number) => {
      const delay = localDelay ?? defaultDelay;
      if (delay === undefined) {
        throw new Error("No delay provided");
      }

      cancel();

      timeoutId.current = setTimeout(() => {
        callback();
      }, delay);
    },
    [callback, defaultDelay]
  );

  useEffect(() => cancel, [cancel]);

  return [start, cancel];
}
