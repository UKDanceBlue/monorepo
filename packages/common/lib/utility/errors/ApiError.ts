import type { ErrorCode } from "./DetailedError.js";

/** @deprecated */
export interface ApiError<HasCause extends boolean = boolean> {
  /**
   * The error code, this should be a short machine-readable code that
   * can be used to identify the error.
   */
  code: ErrorCode;
  /**
   * The error message, this should be a short human-readable, but not
   * necessarily user-friendly, message.
   */
  message: string;
  /**
   * The error details, this should be a longer human-readable, but not
   * necessarily user-friendly, message.
   */
  details?: string;
  /**
   * The error explanation, this should be a user-friendly message.
   * If present, this should be shown to the user.
   */
  explanation?: string;
  /**
   * The error cause, this should be the original error that caused the
   * error response. This should not be shown to the user and for some
   * errors can be used to address the issue.
   */
  cause?: HasCause extends true ? unknown : never;
}

/** @deprecated */
export function isApiError(error: unknown): error is ApiError {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    typeof error.code !== "string" ||
    !("errorMessage" in error) ||
    typeof error.errorMessage !== "string"
  ) {
    return false;
  } else if (
    "errorDetails" in error &&
    typeof error.errorDetails !== "string"
  ) {
    return false;
  } else if (
    "errorExplanation" in error &&
    typeof error.errorExplanation !== "string"
  ) {
    return false;
  } else {
    return true;
  }
}
