import { ConcreteError, ErrorCode } from "@ukdanceblue/common/error";
import type { ZodError as RawZodError } from "zod";
export class ZodError extends ConcreteError {
  readonly error: RawZodError;
  constructor(error: RawZodError) {
    super();
    this.error = error;
  }
  get message() {
    return this.error.message;
  }
  readonly expose = false;

  get tag(): ErrorCode.ZodError {
    return ErrorCode.ZodError;
  }
}
