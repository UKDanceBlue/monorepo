import type { ApiError } from "../response/JsonResponse.js";

export const ErrorCode = {
  // Our codes
  Unknown: "UNKNOWN",
  NotFound: "NOT_FOUND",
  InvalidRequest: "INVALID_REQUEST",
  MissingRequiredInput: "MISSING_REQUIRED_INPUT",
  NotLoggedIn: "NOT_LOGGED_IN",
  Unauthorized: "UNAUTHORIZED",
  InternalFailure: "INTERNAL_FAILURE",
  DatabaseFailure: "DATABASE_FAILURE",

  // GraphQL codes
  GQLGraphqlParseFailed: "GRAPHQL_PARSE_FAILED",
  GQLGraphqlValidationFailed: "GRAPHQL_VALIDATION_FAILED",
  GQLBadUserInput: "BAD_USER_INPUT",
  GQLPersistedQueryNotFound: "PERSISTED_QUERY_NOT_FOUND",
  GQLPersistedQueryNotSupported: "PERSISTED_QUERY_NOT_SUPPORTED",
  GQLOperationResolutionFailure: "OPERATION_RESOLUTION_FAILURE",
  GQLBadRequest: "BAD_REQUEST",
  GQLInternalServerError: "INTERNAL_SERVER_ERROR",
} as const;
export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export function isErrorCode(code: unknown): code is ErrorCode {
  return Object.values(ErrorCode).includes(code as ErrorCode);
}

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