import { ErrorCode } from "@ukdanceblue/common/error";
import { ConcreteError } from "@ukdanceblue/common/error";
import type { DrizzleError } from "drizzle-orm";

export class ParsedDrizzleError extends ConcreteError {
  constructor(private readonly error: DrizzleError) {
    super();
  }

  get message(): string {
    return this.error.message;
  }
  get expose(): boolean {
    return false;
  }
  readonly tag: ErrorCode.DrizzleError = ErrorCode.DrizzleError;
}
