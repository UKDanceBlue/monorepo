import { Err, Ok, type Option, type Result } from "ts-results-es";

import { ExtendedError } from "./error.js";
import * as ErrorCode from "./errorCode.js";
import { optionOf } from "./option.js";

export class NotFoundError extends ExtendedError {
  constructor(
    public readonly what?: string,
    public readonly where?: string
  ) {
    super(
      optionOf(what).mapOr("Not found", (what) => `Not found: ${what}`),
      ErrorCode.NotFound.description
    );
  }

  get detailedMessage(): string {
    const what = this.what ?? "Not found";
    const where = this.where ? ` in ${this.where}` : "";
    return `Not found: ${what}${where}`;
  }

  readonly expose = true;

  get tag(): ErrorCode.NotFound {
    return ErrorCode.NotFound;
  }

  static fromOption<T>(
    option: Option<T>,
    ...params: ConstructorParameters<typeof NotFoundError>
  ): Result<T, NotFoundError> {
    return option.isSome()
      ? Ok(option.value)
      : Err(new NotFoundError(...params));
  }
}

export class TimeoutError extends ExtendedError {
  constructor(public readonly what?: string) {
    super(`${what ?? "A task"} took too long`);
  }

  readonly expose = false;

  get tag(): ErrorCode.Timeout {
    return ErrorCode.Timeout;
  }
}

export class InvalidOperationError extends ExtendedError {
  constructor(public readonly what: string) {
    super(`Invalid operation: ${what}`, ErrorCode.InvalidOperation.description);
  }

  readonly expose = false;

  get tag(): ErrorCode.InvalidOperation {
    return ErrorCode.InvalidOperation;
  }
}

export class InvalidArgumentError extends ExtendedError {
  constructor(public readonly what: string) {
    super(`Invalid argument: ${what}`, ErrorCode.InvalidArgument.description);
  }

  readonly expose = false;

  get tag(): ErrorCode.InvalidArgument {
    return ErrorCode.InvalidArgument;
  }
}

export class InvalidStateError extends ExtendedError {
  constructor(public readonly what: string) {
    super(`Invalid state: ${what}`, ErrorCode.InvalidState.description);
  }

  readonly expose = false;

  get tag(): ErrorCode.InvalidState {
    return ErrorCode.InvalidState;
  }
}

export class InvariantError extends ExtendedError {
  constructor(public readonly what: string) {
    super(
      `Invariant violation: ${what}`,
      ErrorCode.InvariantViolation.description
    );
  }

  readonly expose = false;

  get tag(): ErrorCode.InvariantViolation {
    return ErrorCode.InvariantViolation;
  }
}
