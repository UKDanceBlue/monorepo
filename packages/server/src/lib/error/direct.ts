import { Maybe } from "true-myth";

import { ConcreteError } from "./error.js";

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
}
