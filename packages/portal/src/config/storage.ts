import { useEffect, useState } from "react";

export class StorageManager {
  constructor(
    private readonly namespace: string,
    private readonly storage: Storage | undefined
  ) {}

  static Local = new StorageManager(
    "local",
    "localStorage" in globalThis ? globalThis.localStorage : undefined
  );
  static Session = new StorageManager(
    "session",
    "sessionStorage" in globalThis ? globalThis.sessionStorage : undefined
  );

  static keys = {
    selectedMarathon: "selected-marathon",
    masquerade: "masquerade",
    darkMode: "dark-mode",
    collapseSidebar: "collapse-sidebar",
  } as const;

  subscriptions = new Map<string, Set<(value: string | null) => void>>();

  subscribe(id: string, callback: (value: string | null) => void) {
    if (!this.subscriptions.has(id)) {
      this.subscriptions.set(id, new Set());
    }

    this.subscriptions.get(id)?.add(callback);
  }

  unsubscribe(id: string, callback: (value: string | null) => void) {
    if (this.subscriptions.has(id)) {
      this.subscriptions.get(id)?.delete(callback);
    }
  }

  set(id: string, value: string | null) {
    const key = `ukdb-${this.namespace}.${id}`;
    if (this.storage === undefined) {
      throw new Error("Storage is not available");
    }
    if (value === null) {
      this.storage.removeItem(key);
    } else {
      this.storage.setItem(key, value);
    }
    this.subscriptions.get(id)?.forEach((callback) => callback(value));
  }

  get(id: string) {
    const key = `ukdb-${this.namespace}.${id}`;
    if (this.storage === undefined) {
      return null;
    }
    const val = this.storage.getItem(key);
    if (val === "undefined") {
      return null;
    }
    return val;
  }
}

export const useStorageValue = (
  manager: StorageManager,
  id: string,
  defaultValue: string | null = null
): [value: string | null, setValue: (value: string | null) => void] => {
  const [value, setValue] = useState<string | null>(
    manager.get(id) ?? defaultValue
  );

  useEffect(() => {
    const callback = (value: string | null) => setValue(value);
    manager.subscribe(id, callback);
    return () => manager.unsubscribe(id, callback);
  }, [manager, id]);

  return [value, (value: string | null) => manager.set(id, value)];
};
