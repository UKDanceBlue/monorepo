import type { ApiError } from "@ukdanceblue/common";
import { isLegacyErrorCode, LegacyErrorCode } from "@ukdanceblue/common";
import type { TypeOpen } from "antd/es/message/interface.js";
import type { ModalFunc } from "antd/es/modal/confirm.js";
import type { NotificationInstance } from "antd/es/notification/interface.js";
import { CombinedError } from "urql";

export type ExtendedApiError = ApiError;

export function extractServerError(error: CombinedError): ExtendedApiError[] {
  const apiErrors: ExtendedApiError[] = [];

  for (const graphQLError of error.graphQLErrors) {
    const apiError: ExtendedApiError = {
      message: graphQLError.message,
      code: LegacyErrorCode.Unknown,
    };

    if (isLegacyErrorCode(graphQLError.extensions.code)) {
      apiError.code = graphQLError.extensions.code;
    }

    // if (Array.isArray(graphQLError.extensions.stacktrace)) {
    //   apiError.cause = graphQLError.extensions.stacktrace.map(String);
    // }

    if (typeof graphQLError.extensions.details === "string") {
      apiError.details = graphQLError.extensions.details;
    }

    if (typeof graphQLError.extensions.explanation === "string") {
      apiError.explanation = graphQLError.extensions.explanation;
    }

    if (graphQLError.extensions.cause) {
      apiError.cause = JSON.stringify(graphQLError.extensions.cause);
    }

    apiErrors.push(apiError);
  }

  if (error.networkError) {
    const apiError: ExtendedApiError = {
      message: error.networkError.message,
      code: LegacyErrorCode.Unknown,
      cause: error.networkError,
    };

    if ("bodyText" in error.networkError) {
      apiError.explanation = `Error Name: ${error.networkError.name}`;
    } else if ("result" in error.networkError) {
      apiError.explanation = `Error Name: ${error.networkError.name}`;
      if (
        typeof error.networkError.result === "object" &&
        error.networkError.result !== null &&
        "errors" in error.networkError.result &&
        Array.isArray(error.networkError.result.errors) &&
        error.networkError.result.errors.every(
          (e) => typeof e === "object" && e !== null
        )
      ) {
        const { errors } = error.networkError.result;
        for (const maybeAnApiError of errors) {
          console.error("maybeAnApiError", maybeAnApiError);
        }
      } else {
        console.error("error.networkError.result", error.networkError.result);
      }
    } else {
      console.error("error.networkError", error.networkError);
    }

    apiErrors.push(apiError);
  }

  if (apiErrors.length === 0) {
    apiErrors.push({
      message: error.message,
      code: LegacyErrorCode.Unknown,
      cause: error,
    });
  }

  return apiErrors;
}

export function handleUnknownError(
  error: unknown,
  options: {
    message?: TypeOpen;
    notification?: NotificationInstance["error"];
    modal?: ModalFunc;
    onClose?: () => void;
  }
) {
  if (error instanceof CombinedError) {
    const apiErrors = extractServerError(error);
    for (const apiError of apiErrors) {
      handleApiError(apiError, options);
    }
    return;
  }

  const apiError: ApiError = {
    message: "An unknown error occurred.",
    code: LegacyErrorCode.Unknown,
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
    message?: TypeOpen;
    notification?: NotificationInstance["error"];
    modal?: ModalFunc;
    onClose?: () => void;
  }
) {
  console.error(error);

  if (options.message) {
    void options.message(error.explanation ?? error.message).then(() => {
      options.onClose?.();
    });
  }

  if (options.modal) {
    options.modal({
      title: error.message,
      content: error.explanation,
      afterClose() {
        options.onClose?.();
      },
    });
  }

  if (options.notification) {
    options.notification({
      message: error.message,
      description: error.explanation,
      onClose() {
        options.onClose?.();
      },
    });
  }
}
