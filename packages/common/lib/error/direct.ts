import type { Option } from "ts-results-es";

import { ConcreteError } from "./error.js";
import * as ErrorCode from "./errorCode.js";
import { optionOf } from "./option.js";

export class NotFoundError extends ConcreteError {
  readonly #what: Option<string>;
  readonly #where: Option<string>;
  readonly #why: Option<string>;
  readonly #sensitive: boolean;

  constructor({
    what,
    where,
    why,
    sensitive = true,
  }: {
    what?: string;
    where?: string;
    why?: string;
    sensitive?: boolean;
  }) {
    super();
    this.#what = optionOf(what);
    this.#where = optionOf(where);
    this.#why = optionOf(why);
    this.#sensitive = sensitive;
  }

  get message(): string {
    return this.#what.mapOr("Not found", (what) => `Not found: ${what}`);
  }

  get detailedMessage(): string {
    const what = this.#what.unwrapOr("unknown");
    const where = this.#where.mapOr("", (where) => ` at ${where}`);
    const why = this.#why.mapOr("", (why) => ` because ${why}`);
    return `Not found: ${what}${where}${why}`;
  }

  get expose(): boolean {
    return !this.#sensitive;
  }

  get stack(): string | undefined {
    return undefined;
  }

  get tag(): ErrorCode.NotFound {
    return ErrorCode.NotFound;
  }
}

export class TimeoutError extends ConcreteError {
  readonly #what: string | null;

  constructor(what?: string) {
    super();
    this.#what = what ?? null;
  }

  get message(): string {
    return `${this.#what ?? "A task"} took too long`;
  }

  get expose() {
    return false;
  }

  get tag(): ErrorCode.Timeout {
    return ErrorCode.Timeout;
  }
}

export class InvalidOperationError extends ConcreteError {
  readonly #what: string;

  constructor(what: string) {
    super();
    this.#what = what;
  }

  get message(): string {
    return `Invalid operation: ${this.#what}`;
  }

  get expose() {
    return false;
  }

  get tag(): ErrorCode.InvalidOperation {
    return ErrorCode.InvalidOperation;
  }
}

export class InvalidArgumentError extends ConcreteError {
  readonly #what: string;

  constructor(what: string) {
    super();
    this.#what = what;
  }

  get message(): string {
    return `Invalid argument: ${this.#what}`;
  }

  get expose() {
    return false;
  }

  get tag(): ErrorCode.InvalidArgument {
    return ErrorCode.InvalidArgument;
  }
}

export class InvalidStateError extends ConcreteError {
  readonly #what: string;

  constructor(what: string) {
    super();
    this.#what = what;
  }

  get message(): string {
    return `Invalid state: ${this.#what}`;
  }

  get expose() {
    return false;
  }

  get tag(): ErrorCode.InvalidState {
    return ErrorCode.InvalidState;
  }
}

export class InvariantError extends ConcreteError {
  readonly #what: string;

  constructor(what: string) {
    super();
    this.#what = what;
  }

  get message(): string {
    return `Invariant violation: ${this.#what}`;
  }

  get expose() {
    return false;
  }

  get tag(): ErrorCode.InvariantViolation {
    return ErrorCode.InvariantViolation;
  }
}
