import type { ZodError as RawZodError } from "zod";

import { ConcreteError } from "./error.js";

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
}
