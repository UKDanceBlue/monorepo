import type { ApiError } from "./ApiError.js";

/** @deprecated Use ConcreteError instead */
export const ErrorCode = {
  // Our codes
  Unknown: "UNKNOWN",
  NotFound: "NotFound",
  InvalidRequest: "InvalidRequest",
  MissingRequiredInput: "MissingRequiredInput",
  NotLoggedIn: "NotLoggedIn",
  Unauthorized: "Unauthorized",
  InternalFailure: "InternalFailure",
  DatabaseFailure: "DatabaseFailure",
  PreconditionsFailed: "PreconditionsFailed",

  // GraphQL codes
  GQLGraphqlParseFailed: "GQLGraphqlParseFailed",
  GQLGraphqlValidationFailed: "GQLGraphqlValidationFailed",
  GQLBadUserInput: "GQLBadUserInput",
  GQLPersistedQueryNotFound: "GQLPersistedQueryNotFound",
  GQLPersistedQueryNotSupported: "GQLPersistedQueryNotSupported",
  GQLOperationResolutionFailure: "GQLOperationResolutionFailure",
  GQLBadRequest: "GQLBadRequest",
  GQLInternalServerError: "GQLInternalServerError",
} as const;
/** @deprecated Use ConcreteError instead */
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** @deprecated Use ConcreteError instead */
export function isErrorCode(code: unknown): code is ErrorCode {
  return Object.values(ErrorCode).includes(code as ErrorCode);
}

/** @deprecated Use ConcreteError instead */
export function lookupErrorCode(error: Error | string | ApiError): ErrorCode {
  if (typeof error === "string") {
    if (isErrorCode(error)) {
      return error;
    } else {
      const code = (ErrorCode as Record<string, ErrorCode | undefined>)[error];
      return code == null ? ErrorCode.Unknown : code;
    }
  } else if (error instanceof Error) {
    return ErrorCode.Unknown;
  } else {
    return error.code;
  }
}

/** @deprecated Use ConcreteResult instead */
export class DetailedError extends Error {
  code: ErrorCode;
  details?: string;
  explanation?: string;

  constructor(code: ErrorCode = ErrorCode.Unknown, message?: string) {
    super(message ?? code);
    this.code = code;
  }

  static from(
    val: Error | string | ApiError,
    code: ErrorCode = ErrorCode.Unknown
  ): DetailedError {
    const response = new DetailedError(code);

    if (typeof val === "string") {
      response.message = val;
    } else if (val instanceof Error) {
      response.message = val.message;
      if (val.stack) {
        response.stack = val.stack;
      }
      if (val.cause) {
        response.cause = val.cause;
      }
    } else {
      response.message = val.message;
      response.code = code;
      if (val.details) {
        response.details = val.details;
      }
      if (val.explanation) {
        response.explanation = val.explanation;
      }
      if (val.cause) {
        response.cause = val.cause;
      }
    }

    return response;
  }
}
