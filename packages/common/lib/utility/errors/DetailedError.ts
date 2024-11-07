import type { ApiError } from "./ApiError.js";

/** @deprecated Use ConcreteError instead */
export const LegacyErrorCode = {
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
export type LegacyErrorCode =
  (typeof LegacyErrorCode)[keyof typeof LegacyErrorCode];

/** @deprecated Use ConcreteError instead */
export function isLegacyErrorCode(code: unknown): code is LegacyErrorCode {
  return Object.values(LegacyErrorCode).includes(code as LegacyErrorCode);
}

/** @deprecated Use ConcreteError instead */
export function lookupLegacyErrorCode(
  error: Error | string | ApiError
): LegacyErrorCode {
  if (typeof error === "string") {
    if (isLegacyErrorCode(error)) {
      return error;
    } else {
      const code = (
        LegacyErrorCode as Record<string, LegacyErrorCode | undefined>
      )[error];
      return code ?? LegacyErrorCode.Unknown;
    }
  } else if (error instanceof Error) {
    return LegacyErrorCode.Unknown;
  } else {
    return error.code;
  }
}

/** @deprecated Use ConcreteResult instead */
export class LegacyError extends Error {
  code: LegacyErrorCode;
  details?: string;
  explanation?: string;

  constructor(
    code: LegacyErrorCode = LegacyErrorCode.Unknown,
    message?: string
  ) {
    super(message ?? code);
    this.code = code;
  }

  static from(
    val: Error | string | ApiError,
    code: LegacyErrorCode = LegacyErrorCode.Unknown
  ): LegacyError {
    const response = new LegacyError(code);

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
