import { useState } from "react";

export function useOnce<T extends unknown[]>(callback: (...params: T) => void) {
  const [called, setCalled] = useState(false);

  return function (...params: T) {
    if (!called) {
      setCalled(true);
      callback(...params);
    }
  };
}
