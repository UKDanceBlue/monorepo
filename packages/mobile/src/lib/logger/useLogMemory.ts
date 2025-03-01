import { useSyncExternalStore } from "react";

import { Logger } from "./Logger";

export function useLogMemory() {
  const memory = Logger.instance.memoryTransport;

  const memoryStore = useSyncExternalStore(
    memory.subscribe.bind(memory),
    memory.getBuffer.bind(memory)
  );

  return memoryStore;
}
