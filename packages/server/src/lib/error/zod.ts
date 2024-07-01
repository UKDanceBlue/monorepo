import type { ZodError as RawZodError } from "zod";

import { ConcreteError } from "./error.js";

const ZodErrorTag = Symbol("ZodError");
type ZodErrorTag = typeof ZodErrorTag;
export class ZodError extends ConcreteError {
  readonly error: RawZodError;
  constructor(error: RawZodError) {
    super();
    this.error = error;
  }
  get message() {
    return this.error.message;
  }
  get expose() {
    return false;
  }

  static get Tag() {
    return ZodErrorTag;
  }
  get tag(): ZodErrorTag {
    return ZodErrorTag;
  }
}
