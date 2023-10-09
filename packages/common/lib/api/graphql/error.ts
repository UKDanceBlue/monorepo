import type { ApiError } from "../response/JsonResponse.js";

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
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

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
