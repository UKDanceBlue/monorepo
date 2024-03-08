import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AsyncStorageHook } from "@react-native-async-storage/async-storage/lib/typescript/types";
import { useCallback } from "react";

export function useAsyncStorage(key: string): AsyncStorageHook {
  return {
    getItem: useCallback(
      (...args) => AsyncStorage.getItem(key, ...args),
      [key]
    ),
    setItem: useCallback(
      (...args) => AsyncStorage.setItem(key, ...args),
      [key]
    ),
    mergeItem: useCallback(
      (...args) => AsyncStorage.mergeItem(key, ...args),
      [key]
    ),
    removeItem: useCallback(
      (...args) => AsyncStorage.removeItem(key, ...args),
      [key]
    ),
  };
}
