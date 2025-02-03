import { useLocation } from "@tanstack/react-router";
import { App } from "antd";
import type { MessageType } from "antd/es/message/interface.js";
import { useCallback, useEffect, useRef } from "react";
import type { CombinedError } from "urql";

const MAX_ALLOWED_LOADING_MS = 5000;

export function useQueryStatusWatcher({
  error,
  fetching,
  loadingMessage,
}: {
  error?: CombinedError | undefined;
  fetching?: boolean | undefined;
  loadingMessage?: string | (() => string) | undefined;
}): { resetWatcher: () => void } {
  const antApp = App.useApp();
  const { pathname } = useLocation();
  const lastPathname = useRef(pathname);

  const networkLoadingTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const networkLoadingMessageHandle = useRef<MessageType | null>(null);
  const loadingMessageHandle = useRef<MessageType | null>(null);

  useEffect(() => {
    if (error) {
      antApp.message.error(error.message);
    }
  }, [antApp.message, error]);

  useEffect(() => {
    if (fetching && !networkLoadingTimer.current) {
      networkLoadingMessageHandle.current?.();
      networkLoadingTimer.current = setTimeout(() => {
        networkLoadingMessageHandle.current = antApp.message.warning(
          "Looks like something is taking a while, is there a network issue?"
        );
      }, MAX_ALLOWED_LOADING_MS);
    } else if (!fetching) {
      networkLoadingMessageHandle.current?.();
      if (networkLoadingTimer.current) {
        clearTimeout(networkLoadingTimer.current);
        networkLoadingTimer.current = null;
      }
    }
  }, [antApp.message, fetching]);

  useEffect(() => {
    if (fetching && !loadingMessageHandle.current) {
      let message: string;
      if (typeof loadingMessage === "string") {
        message = loadingMessage;
      } else if (typeof loadingMessage === "function") {
        message = loadingMessage();
      } else {
        message = "Loading...";
      }
      loadingMessageHandle.current = antApp.message.loading(message);
    } else if (!fetching && loadingMessageHandle.current) {
      loadingMessageHandle.current();
      loadingMessageHandle.current = null;
    }
  });

  const resetWatcher = useCallback(() => {
    if (networkLoadingTimer.current) {
      clearTimeout(networkLoadingTimer.current);
      networkLoadingTimer.current = null;
    }
    networkLoadingMessageHandle.current?.();
    loadingMessageHandle.current?.();
  }, []);

  // Sorta hacky way to reset the watcher when we navigate to a new page.
  useEffect(() => {
    return () => {
      if (lastPathname.current !== pathname) {
        resetWatcher();
        lastPathname.current = pathname;
      }
    };
  }, [pathname, resetWatcher]);

  return {
    resetWatcher,
  };
}
