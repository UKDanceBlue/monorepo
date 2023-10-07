import type { ApolloError } from "@apollo/client";
import {
  type ApiError,
  ClientAction,
  ErrorCode,
  isErrorCode,
} from "@ukdanceblue/common";
import type { useAppProps } from "antd/es/app/context";
import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";

export type ExtendedApiError = ApiError & { clientActions?: ClientAction[] };

export function extractServerError(error: ApolloError): ExtendedApiError[] {
  const apiErrors: ExtendedApiError[] = [];

  for (const graphQLError of error.graphQLErrors) {
    const apiError: ExtendedApiError = {
      message: graphQLError.message,
      code: ErrorCode.Unknown,
    };

    if (isErrorCode(graphQLError.extensions.code)) {
      apiError.code = graphQLError.extensions.code;
    }

    if (Array.isArray(graphQLError.extensions.stacktrace)) {
      apiError.cause = graphQLError.extensions.stacktrace.map(String);
    }

    if (Array.isArray(graphQLError.extensions.clientActions)) {
      apiError.clientActions = graphQLError.extensions.clientActions.filter(
        (action): action is ClientAction => {
          return Object.values<string>(ClientAction).includes(String(action));
        }
      );
    }

    if (typeof graphQLError.extensions.details === "string") {
      apiError.details = graphQLError.extensions.details;
    }

    if (typeof graphQLError.extensions.explanation === "string") {
      apiError.explanation = graphQLError.extensions.explanation;
    }

    if (graphQLError.extensions.cause) {
      apiError.cause = JSON.stringify(graphQLError.extensions.cause);
    }
  }

  return apiErrors;
}

/**
 * Handle an API error by displaying a notification, message, or modal.
 *
 * @param error The API error to handle.
 * @param options.message An Ant Design message instance.
 * @param options.notification An Ant Design notification instance.
 * @param options.modal An Ant Design modal instance.
 * @param options.onClose A callback to run when the notification or modal is closed or cancelled.
 */
export function handleApiError(
  error: ApiError,
  options: {
    message?: MessageInstance;
    notification?: NotificationInstance;
    modal?: useAppProps["modal"];
    onClose?: () => void;
  }
) {
  console.error(error);

  if (options.message) {
    void options.message.error(error.message).then(options.onClose);
  }

  if (options.modal) {
    options.modal.error({
      title: error.message,
      content: error.explanation,
      afterClose() {
        options.onClose?.();
      },
    });
  }

  if (options.notification) {
    options.notification.error({
      message: error.message,
      description: error.explanation,
      onClose() {
        options.onClose?.();
      },
    });
  }
}
