import { App } from "antd";
import {
  extractServerError,
  handleApiError,
} from "../tools/apolloErrorHandler";
import { useEffect, useRef } from "react";
import { ApolloError, NetworkStatus } from "@apollo/client";
import { MessageType } from "antd/es/message/interface";

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
      extractServerError(error).forEach((err) =>
        handleApiError(err, { message: antApp.message })
      );
    }
  }, [antApp.message, error]);

  useEffect(() => {
    if (networkStatus === NetworkStatus.error && !networkIssueTimer.current) {
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
        antApp.message.warning(
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
  }, [antApp.message, networkStatus]);

  useEffect(() => {
    if (loadingMessage && !loadingMessageHandle.current) {
      loadingMessageHandle.current = antApp.message.loading(loadingMessage);
    } else if (!loadingMessage && loadingMessageHandle.current) {
      loadingMessageHandle.current();
      loadingMessageHandle.current = null;
    }
  });
}
