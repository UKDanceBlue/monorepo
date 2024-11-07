import type {
  GraphQLFormattedError,
  GraphQLResolveInfo,
  SourceLocation,
} from "graphql";
import { getLocation, GraphQLError } from "graphql";
import type { Err } from "ts-results-es";

import * as ErrorCode from "./errorCode.js";
import type { ErrorCodeType } from "./index.js";

export abstract class ConcreteError {
  graphqlError: GraphQLError;

  constructor() {
    this.graphqlError = new GraphQLError("");
  }

  get graphQlError() {
    const formatted = this.graphqlError.toJSON();
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
  abstract get tag(): ErrorCodeType;
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
  readonly #stack: string | undefined;
  readonly #info: GraphQLResolveInfo | undefined;

  constructor({ error, stack }: Err<ConcreteError>, info?: GraphQLResolveInfo) {
    super(error.message);
    this.cause = error;
    this.#stack = stack;
    this.#info = info;
    this.graphQlError = error.graphQlError;
  }

  get extensions(): GraphQLFormattedErrorExtensions {
    return {
      ...this.graphQlError.extensions,
      stacktrace: this.stack ? this.stack.split("\n") : undefined,
    };
  }

  get locations(): readonly SourceLocation[] | undefined {
    return (
      this.#info?.fieldNodes
        .map((node) =>
          node.loc ? getLocation(node.loc.source, node.loc.start) : undefined
        )
        .filter(
          (location): location is SourceLocation => location !== undefined
        ) ?? this.graphQlError.locations
    );
  }

  get path(): readonly (string | number)[] | undefined {
    let current = this.#info?.path;
    if (current) {
      const path = [];
      while (current) {
        path.unshift(current.key);
        current = current.prev;
      }
      return path;
    } else {
      return this.graphQlError.path;
    }
  }

  get stack(): string | undefined {
    return this.cause.expose ? (this.cause.stack ?? this.#stack) : undefined;
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
