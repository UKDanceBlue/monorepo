import { ErrorCode, ExtendedError } from "@ukdanceblue/common/error";
import type { ZodError as RawZodError } from "zod";
export class ZodError extends ExtendedError {
  declare cause?: RawZodError;

  constructor(public readonly zodError: RawZodError) {
    super(zodError.message);
    this.stack = zodError.stack;
    this.cause = zodError;
  }
  readonly expose = false;

  get tag(): ErrorCode.ZodError {
    return ErrorCode.ZodError;
  }
}
