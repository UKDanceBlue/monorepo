import type { GraphQLFormattedError } from "graphql";
import { GraphQLError } from "graphql";
import type { Mutable } from "utility-types";

import { debugStringify } from "../utility/errors/debugStringify.js";
import * as ErrorCode from "./errorCode.js";
import { ErrorType } from "./errorrType.js";
import type { ErrorCodeType } from "./index.js";

/**
 * Abstract class which includes a number of properties and methods for detailed error handling.
 */
export abstract class ExtendedError extends GraphQLError {
  constructor(
    public readonly message: string,
    errorCode?: string
  ) {
    super(message, {
      extensions: {
        code: errorCode,
      },
    });
  }

  public readonly timestamp = new Date();

  /**
   * A debugging-oriented string representation of the error, defaults to the message.
   */
  get detailedMessage(): string {
    return this.message;
  }

  /**
   * Indicates whether the error should be exposed to the client
   *
   * Should only be true for errors that are don't contain sensitive information.
   */
  abstract get expose(): boolean;

  /**
   * Gets the tag associated with the error, can be used to identify the error type.
   */
  abstract get tag(): ErrorCodeType;

  /**
   * Gets the type of the error. Used for error handling and categorization.
   */
  get type(): ErrorType {
    return ErrorType.Internal;
  }

  /**
   * Converts the error to a string representation, by default this is based on the message and (if different) the detailed message.
   */
  toString() {
    return this.message === this.detailedMessage
      ? this.message
      : `${this.message} - ${this.detailedMessage}`;
  }

  /**
   * Converts the error to a plain JSON representation.
   */
  toJSON(shouldIncludeSensitiveInfo = false): Readonly<
    GraphQLFormattedError & {
      details?: string;
    }
  > {
    const object: Mutable<GraphQLFormattedError> & {
      details?: string;
    } = {
      message: this.message,
    };
    if (shouldIncludeSensitiveInfo || this.expose) {
      object.extensions = this.extensions;
      if (this.detailedMessage && this.detailedMessage !== this.message) {
        object.details = this.detailedMessage;
      }
      if (this.locations) {
        object.locations = this.locations;
      }
      if (this.path) {
        object.path = this.path;
      }
    }
    return object;
  }

  /**
   * Gets the string tag representation of the error.
   */
  get [Symbol.toStringTag]() {
    return this.toString();
  }
}

/**
 * Represents a JavaScript error that extends the `ExtendedError` class.
 * This class wraps a native JavaScript `Error` object and provides additional
 * properties and methods for error handling.
 */
export class JsError extends ExtendedError {
  declare readonly cause: Error;

  constructor(error: Error) {
    super(error.message, ErrorCode.JsError.description);
    this.cause = error;
    this.stack = error.stack;
  }

  readonly expose = false;

  get tag(): ErrorCode.JsError {
    return ErrorCode.JsError;
  }
}

/**
 * The unknown error is generally only used when working with error data that connot be parsed more specifically than a simple string.
 */
export class UnknownError extends ExtendedError {
  // We use a rest parameter here to detect when undefined is passed. If we just allowed an optional parameter, we wouldn't be able to distinguish between `new UnknownError()` and `new UnknownError(undefined)`.
  constructor(...message: unknown[]) {
    super(
      message.length === 0
        ? "An unknown error occurred"
        : message.length === 1
          ? debugStringify(message[0], false, true)
          : `Multiple errors occurred: ${message.map((m) => debugStringify(m, false, true)).join(", ")}`,
      ErrorCode.Unknown.description
    );
  }

  readonly expose = false;

  get tag(): ErrorCode.Unknown {
    return ErrorCode.Unknown;
  }
}

export type BasicError = JsError | UnknownError;

/**
 * Converts an unknown error into a BasicError.
 *
 * If the provided error is an instance of Error, it will be wrapped in a JsError.
 * Otherwise, it will be wrapped in an UnknownError.
 */
export function toBasicError(error: unknown): BasicError {
  return error instanceof Error ? new JsError(error) : new UnknownError(error);
}

/**
 * Converts an unknown error into an ExtendedError.
 *
 * If the provided error is an instance of ExtendedError, it will be returned as is.
 *
 * Any other error will be passed to `toBasicError`.
 */
export function toSomeExtendedError(error: unknown): ExtendedError {
  return error instanceof ExtendedError ? error : toBasicError(error);
}
