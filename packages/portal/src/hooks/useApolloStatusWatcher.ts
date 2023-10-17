import type { ApolloError } from "@apollo/client";
import { NetworkStatus } from "@apollo/client";
import { App } from "antd";
import type { MessageType } from "antd/es/message/interface";
import { useEffect, useRef } from "react";

import {
  extractServerError,
  handleApiError,
} from "../tools/apolloErrorHandler";

const MAX_ALLOWED_ERROR_MS = 500;
const MAX_ALLOWED_LOADING_MS = 5000;

export function useApolloStatusWatcher({
  error,
  networkStatus,
  loadingMessage,
}: {
  error?: ApolloError | undefined;
  networkStatus?: NetworkStatus | undefined;
  loadingMessage?: string | undefined;
}) {
  const antApp = App.useApp();

  const networkIssueTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const networkIssueMessageHandle = useRef<MessageType | null>(null);
  const networkLoadingTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const networkLoadingMessageHandle = useRef<MessageType | null>(null);
  const loadingMessageHandle = useRef<MessageType | null>(null);

  useEffect(() => {
    if (error) {
      for (const err of extractServerError(error))
        handleApiError(err, { message: antApp.message });
    }
  }, [antApp.message, error]);

  useEffect(() => {
    // No need to show a generic network error if we know the specific error
    if (
      networkStatus === NetworkStatus.error &&
      !networkIssueTimer.current &&
      !error
    ) {
      networkIssueMessageHandle.current?.();
      networkIssueTimer.current = setTimeout(() => {
        networkIssueMessageHandle.current = antApp.message.error(
          "Network error detected."
        );
      }, MAX_ALLOWED_ERROR_MS);
    } else if (networkStatus !== NetworkStatus.error) {
      networkIssueMessageHandle.current?.();
      if (networkIssueTimer.current) {
        clearTimeout(networkIssueTimer.current);
        networkIssueTimer.current = null;
      }
    }

    if (
      networkStatus === NetworkStatus.loading &&
      !networkLoadingTimer.current
    ) {
      networkLoadingMessageHandle.current?.();
      networkLoadingTimer.current = setTimeout(() => {
        void antApp.message.warning(
          "Looks like something is taking a while, is there a network issue?"
        );
      }, MAX_ALLOWED_LOADING_MS);
    } else if (networkStatus !== NetworkStatus.loading) {
      networkLoadingMessageHandle.current?.();
      if (networkLoadingTimer.current) {
        clearTimeout(networkLoadingTimer.current);
        networkLoadingTimer.current = null;
      }
    }
  }, [antApp.message, error, networkStatus]);

  useEffect(() => {
    if (loadingMessage && !loadingMessageHandle.current) {
      loadingMessageHandle.current = antApp.message.loading(loadingMessage);
    } else if (!loadingMessage && loadingMessageHandle.current) {
      loadingMessageHandle.current();
      loadingMessageHandle.current = null;
    }
  });
}
