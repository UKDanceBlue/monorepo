import { unwrapResolverError } from "@apollo/server/errors";
import type { GraphQLFormattedErrorWithExtensions } from "@ukdanceblue/common/error";
import { ErrorCode, FormattedConcreteError } from "@ukdanceblue/common/error";
import type { GraphQLFormattedError } from "graphql";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import type { Writable } from "utility-types";

/**
 *
 * @param originalFormattedError
 * @param maybeWrappedError
 * @param shouldIncludeSensitiveInfo
 */
export function formatError(
  originalFormattedError: GraphQLFormattedError,
  maybeWrappedError: unknown,
  shouldIncludeSensitiveInfo: boolean
): GraphQLFormattedError {
  const error = unwrapResolverError(maybeWrappedError);

  if (error instanceof FormattedConcreteError) {
    return error.graphQlError;
  } else if (error instanceof GraphQLError) {
    return error.toJSON();
  }

  const formattedError: Writable<GraphQLFormattedErrorWithExtensions> = {
    ...originalFormattedError,
    extensions: {
      ...originalFormattedError.extensions,
      code: ErrorCode.Unknown,
      stacktrace:
        shouldIncludeSensitiveInfo &&
        Array.isArray(originalFormattedError.extensions?.stacktrace)
          ? originalFormattedError.extensions.stacktrace.map(String)
          : [],
      clientActions: [],
      internalDetails: {},
    },
  };

  if (
    error instanceof jwt.NotBeforeError ||
    error instanceof jwt.TokenExpiredError
  ) {
    formattedError.extensions.code = ErrorCode.Unauthenticated;
  } else if (typeof error === "string") {
    formattedError.message = error;
  } else if (typeof error === "object" && error != null) {
    if ("message" in error && typeof error.message === "string") {
      formattedError.message = error.message;
    }
    if ("details" in error && typeof error.details === "string") {
      formattedError.extensions.details = error.details;
    }
    if ("explanation" in error && typeof error.explanation === "string") {
      formattedError.extensions.explanation = error.explanation;
    }
    if (
      "stacktrace" in error &&
      Array.isArray(error.stacktrace) &&
      shouldIncludeSensitiveInfo &&
      formattedError.extensions.stacktrace?.length === 0
    ) {
      formattedError.extensions.stacktrace = error.stacktrace.map(String);
    }
  }

  if (!shouldIncludeSensitiveInfo) {
    delete formattedError.extensions.internalDetails;
    delete formattedError.extensions.stacktrace;
  }

  return formattedError;
}
