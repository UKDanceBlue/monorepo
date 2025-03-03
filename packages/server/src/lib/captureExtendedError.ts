import * as Sentry from "@sentry/node";
import type { ExtendedError } from "@ukdanceblue/common/error";
import { ErrorCode } from "@ukdanceblue/common/error";

export function captureExtendedError(error: ExtendedError) {
  if (error.tag === ErrorCode.JsError) {
    Sentry.captureException(error.cause);
  } else {
    Sentry.captureException(error, {
      extra: {
        detailedMessage: error.detailedMessage,
      },
      tags: {
        code: error.tag.description,
      },
    });
  }
}
