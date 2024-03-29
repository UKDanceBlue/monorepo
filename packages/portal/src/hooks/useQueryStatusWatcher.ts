import { App } from "antd";
import type { MessageType } from "antd/es/message/interface";
import { useEffect, useRef } from "react";
import type { CombinedError } from "urql";

import {
  extractServerError,
  handleApiError,
} from "../tools/apolloErrorHandler.js";

// const MAX_ALLOWED_ERROR_MS = 500;
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

  const networkLoadingTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const networkLoadingMessageHandle = useRef<MessageType | null>(null);
  const loadingMessageHandle = useRef<MessageType | null>(null);

  useEffect(() => {
    if (error) {
      for (const err of extractServerError(error))
        handleApiError(err, { message: antApp.message.error });
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

  return {
    resetWatcher: () => {
      if (networkLoadingTimer.current) {
        clearTimeout(networkLoadingTimer.current);
        networkLoadingTimer.current = null;
      }
      networkLoadingMessageHandle.current?.();
      loadingMessageHandle.current?.();
    },
  };
}
