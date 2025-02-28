import { unwrapResolverError } from "@apollo/server/errors";
import { ErrorCode, ExtendedError } from "@ukdanceblue/common/error";
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

  if (error instanceof ExtendedError) {
    return error.toJSON(shouldIncludeSensitiveInfo);
  } else if (error instanceof GraphQLError) {
    return error.toJSON();
  }

  let stacktrace: string[] | undefined;
  if (error instanceof Error) {
    stacktrace = error.stack?.split("\n") ?? [];
  } else if (error instanceof ExtendedError) {
    stacktrace = error.stack?.split("\n") ?? [];
  }

  const formattedError: Writable<
    GraphQLFormattedError & {
      extensions: {
        code?: string;
      };
    }
  > = {
    ...originalFormattedError,
    extensions: {
      ...originalFormattedError.extensions,
      code: ErrorCode.Unknown.description,
      stacktrace: shouldIncludeSensitiveInfo
        ? stacktrace ||
          (Array.isArray(originalFormattedError.extensions?.stacktrace)
            ? originalFormattedError.extensions.stacktrace.map(String)
            : [])
        : [],
    },
  };

  if (
    error instanceof jwt.NotBeforeError ||
    error instanceof jwt.TokenExpiredError
  ) {
    formattedError.extensions.code = ErrorCode.Unauthenticated.description;
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
  }

  if (!shouldIncludeSensitiveInfo) {
    delete formattedError.extensions.internalDetails;
    delete formattedError.extensions.stacktrace;
  }

  return formattedError;
}
