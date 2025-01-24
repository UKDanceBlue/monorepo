import type { GraphQLFormattedError } from "graphql";
import { GraphQLError } from "graphql";

import { debugStringify } from "../utility/errors/debugStringify.js";
import * as ErrorCode from "./errorCode.js";
import type { ErrorCodeType } from "./index.js";

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

  get detailedMessage(): string {
    return this.message;
  }

  abstract get expose(): boolean;

  abstract get tag(): ErrorCodeType;

  toString() {
    return this.message === this.detailedMessage
      ? this.message
      : `${this.message} - ${this.detailedMessage}`;
  }

  toJSON(): GraphQLFormattedError & {
    details: string;
  } {
    return {
      message: this.message,
      details: this.detailedMessage,
      extensions: this.extensions,
      locations: this.locations,
      path: this.path,
    };
  }

  get [Symbol.toStringTag]() {
    return this.toString();
  }
}

export class JsError extends ExtendedError {
  readonly error: Error;

  constructor(error: Error) {
    super(error.message, ErrorCode.JsError.description);
    this.error = error;
  }

  readonly expose = false;

  get stack(): string | undefined {
    return this.error.stack;
  }

  get tag(): ErrorCode.JsError {
    return ErrorCode.JsError;
  }
}

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

export function toBasicError(error: unknown): BasicError {
  return error instanceof Error ? new JsError(error) : new UnknownError(error);
}
