import { ApolloError } from "@apollo/client";
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

  for (const clientError of error.clientErrors) {
    const apiError: ExtendedApiError = {
      message: clientError.message,
      code: ErrorCode.Unknown,
      cause: clientError,
    };

    if (clientError instanceof Error) {
      apiError.cause = clientError;
    }

    apiErrors.push(apiError);
  }

  for (const protocolError of error.protocolErrors) {
    const apiError: ExtendedApiError = {
      message: protocolError.message,
      code: ErrorCode.Unknown,
      cause: protocolError,
    };

    if (protocolError instanceof Error) {
      apiError.cause = protocolError;
    }

    apiErrors.push(apiError);
  }

  if (error.networkError) {
    const apiError: ExtendedApiError = {
      message: error.networkError.message,
      code: ErrorCode.Unknown,
      cause: error.networkError,
    };

    if ("bodyText" in error.networkError) {
      // ServerParseError
      apiError.explanation = `Status Code: ${error.networkError.statusCode}`;
    } else if ("result" in error.networkError) {
      // ServerError
      apiError.explanation = `Status Code: ${error.networkError.statusCode}`;
      if (
        typeof error.networkError.result === "object" &&
        "errors" in error.networkError.result
      ) {
        const maybeAnApiError = error.networkError.result.errors?.[0];
        if (maybeAnApiError?.message) {
          apiError.message = maybeAnApiError.message;
        }
        if (maybeAnApiError?.extensions?.clientActions) {
          apiError.clientActions = maybeAnApiError.extensions.clientActions;
        }
        if (maybeAnApiError?.extensions?.code) {
          apiError.code = maybeAnApiError.code;
        }
        if (maybeAnApiError?.extensions?.details) {
          apiError.details = maybeAnApiError.details;
        }
      }
    }

    apiErrors.push(apiError);
  }

  if (apiErrors.length === 0) {
    apiErrors.push({
      message: error.message,
      code: ErrorCode.Unknown,
      cause: error,
    });
  }

  return apiErrors;
}

export function handleUnknownError(
  error: unknown,
  options: {
    message?: MessageInstance;
    notification?: NotificationInstance;
    modal?: useAppProps["modal"];
    onClose?: () => void;
  }
) {
  if (error instanceof ApolloError) {
    const apiErrors = extractServerError(error);
    for (const apiError of apiErrors) {
      handleApiError(apiError, options);
    }
    return;
  }

  const apiError: ApiError = {
    message: "An unknown error occurred.",
    code: ErrorCode.Unknown,
    cause: error,
  };

  if (typeof error === "string") {
    apiError.message = error;
  } else if (error instanceof Error) {
    apiError.message = error.message;
  } else if (typeof error === "object" && error !== null) {
    apiError.message = JSON.stringify(error);
  } else {
    apiError.message = String(error);
  }

  handleApiError(apiError, options);
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
