import type { Result } from "true-myth";
import { err, ok } from "true-myth/result";

export abstract class ConcreteError {
  abstract get message(): string;
  get detailedMessage(): string {
    return this.message;
  }
  abstract get expose(): boolean;
  get stack(): string | undefined {
    return undefined;
  }
  abstract get tag(): unknown;
}

const JsErrorTag = Symbol("JsError");
type JsErrorTag = typeof JsErrorTag;
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

  static get Tag(): JsErrorTag {
    return JsErrorTag;
  }

  get tag(): JsErrorTag {
    return JsErrorTag;
  }
}

const UnknownErrorTag = Symbol("UnknownError");
type UnknownErrorTag = typeof UnknownErrorTag;
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

  static get Tag(): UnknownErrorTag {
    return UnknownErrorTag;
  }
  get tag(): UnknownErrorTag {
    return UnknownErrorTag;
  }
}

export type BasicError = JsError | UnknownError;

export function toBasicError(error: unknown): BasicError {
  return error instanceof Error ? new JsError(error) : new UnknownError(error);
}

export async function flipPromise<T, E>(
  r:
    | Result<Promise<T>, Promise<E>>
    | Result<T, Promise<E>>
    | Result<Promise<T>, E>
    | Result<T, E>
): Promise<Result<T, E>> {
  return r.isOk ? ok<T, E>(await r.value) : err<T, E>(await r.error);
}
