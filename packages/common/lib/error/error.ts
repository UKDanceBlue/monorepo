import type { GraphQLFormattedError, SourceLocation } from "graphql";
import { GraphQLError } from "graphql";
import * as ErrorCode from "./errorCode.js";

export abstract class ConcreteError {
  #graphQlError: GraphQLError;

  constructor() {
    this.#graphQlError = new GraphQLError("");
  }

  get graphQlError() {
    const formatted = this.#graphQlError.toJSON();
    return {
      ...formatted,
      message: this.message,
      extensions: {
        ...formatted.extensions,
        code: this.tag.description,
      },
    } satisfies GraphQLFormattedErrorWithExtensions;
  }

  abstract get message(): string;
  get detailedMessage(): string {
    return this.message;
  }
  abstract get expose(): boolean;
  get stack(): string | undefined {
    return undefined;
  }
  abstract get tag(): (typeof ErrorCode)[keyof typeof ErrorCode];
}

export interface GraphQLFormattedErrorExtensions {
  code?: string;
  stacktrace?: string[];
  [key: string]: unknown;
}
export type GraphQLFormattedErrorWithExtensions = GraphQLFormattedError & {
  extensions: GraphQLFormattedErrorExtensions;
};

export class FormattedConcreteError
  extends Error
  implements GraphQLFormattedErrorWithExtensions
{
  readonly cause: ConcreteError;
  readonly graphQlError: GraphQLFormattedErrorWithExtensions;
  constructor(error: ConcreteError) {
    super(error.message);
    this.cause = error;
    this.graphQlError = error.graphQlError;
  }

  get extensions(): GraphQLFormattedErrorExtensions {
    return this.graphQlError.extensions;
  }

  get locations(): ReadonlyArray<SourceLocation> | undefined {
    return this.graphQlError.locations;
  }

  get path(): ReadonlyArray<string | number> | undefined {
    return this.graphQlError.path;
  }

  get stack(): string | undefined {
    return this.cause.expose ? this.cause.stack : undefined;
  }
}

export class JsError extends ConcreteError {
  readonly error: Error;

  constructor(error: Error) {
    super();
    this.error = error;
  }

  get message(): string {
    return this.error.message;
  }

  get expose(): boolean {
    return false;
  }

  get stack(): string | undefined {
    return this.error.stack;
  }

  get tag(): ErrorCode.JsError {
    return ErrorCode.JsError;
  }
}

export class UnknownError extends ConcreteError {
  readonly #message: string = "Unknown error";

  // We use a rest parameter here to detect when undefined is passed. If we just allowed an optional parameter, we wouldn't be able to distinguish between `new UnknownError()` and `new UnknownError(undefined)`.
  constructor(...message: unknown[]) {
    super();
    if (message.length > 0) {
      this.#message = String(message[0]);
    }
  }

  get message(): string {
    return this.#message;
  }

  get expose(): boolean {
    return false;
  }

  get tag(): ErrorCode.Unknown {
    return ErrorCode.Unknown;
  }
}

export type BasicError = JsError | UnknownError;

export function toBasicError(error: unknown): BasicError {
  return error instanceof Error ? new JsError(error) : new UnknownError(error);
}
