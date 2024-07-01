import { Maybe } from "true-myth";

import { ConcreteError } from "./error.js";

const NotFoundErrorTag = Symbol("NotFoundError");
type NotFoundErrorTag = typeof NotFoundErrorTag;
export class NotFoundError extends ConcreteError {
  readonly #what: Maybe<string>;
  readonly #where: Maybe<string>;
  readonly #why: Maybe<string>;
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
    this.#what = Maybe.of(what);
    this.#where = Maybe.of(where);
    this.#why = Maybe.of(why);
    this.#sensitive = sensitive;
  }

  get message(): string {
    return this.#what.mapOr("Not found", (what) => `Not found: ${what}`);
  }

  get detailedMessage(): string {
    return `Not found: ${this.#what.unwrapOr("unknown")}${this.#where.match({
      Just: (where) => ` at ${where}`,
      Nothing: () => "",
    })}${this.#why.match({
      Just: (why) => ` because ${why}`,
      Nothing: () => "",
    })}`;
  }

  get expose(): boolean {
    return !this.#sensitive;
  }

  get stack(): string | undefined {
    return undefined;
  }

  static get Tag(): NotFoundErrorTag {
    return NotFoundErrorTag;
  }
  get tag(): NotFoundErrorTag {
    return NotFoundErrorTag;
  }
}

const TimeoutErrorTag = Symbol("TimeoutError");
type TimeoutErrorTag = typeof TimeoutErrorTag;
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

  static get Tag(): TimeoutErrorTag {
    return TimeoutErrorTag;
  }
  get tag(): TimeoutErrorTag {
    return TimeoutErrorTag;
  }
}

const NotImplementedErrorTag = Symbol("NotImplementedError");
type NotImplementedErrorTag = typeof NotImplementedErrorTag;
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

  static get Tag(): NotImplementedErrorTag {
    return NotImplementedErrorTag;
  }
  get tag(): NotImplementedErrorTag {
    return NotImplementedErrorTag;
  }
}

const InvalidArgumentErrorTag = Symbol("InvalidArgumentError");
type InvalidArgumentErrorTag = typeof InvalidArgumentErrorTag;
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

  static get Tag(): InvalidArgumentErrorTag {
    return InvalidArgumentErrorTag;
  }
  get tag(): InvalidArgumentErrorTag {
    return InvalidArgumentErrorTag;
  }
}

const InvalidStateErrorTag = Symbol("InvalidStateError");
type InvalidStateErrorTag = typeof InvalidStateErrorTag;
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

  static get Tag(): InvalidStateErrorTag {
    return InvalidStateErrorTag;
  }
  get tag(): InvalidStateErrorTag {
    return InvalidStateErrorTag;
  }
}

const InvariantErrorTag = Symbol("InvariantError");
type InvariantErrorTag = typeof InvariantErrorTag;
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

  static get Tag(): InvariantErrorTag {
    return InvariantErrorTag;
  }
  get tag(): InvariantErrorTag {
    return InvariantErrorTag;
  }
}
