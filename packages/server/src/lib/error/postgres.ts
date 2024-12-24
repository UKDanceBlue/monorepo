import type { BasicError } from "@ukdanceblue/common/error";
import { ErrorCode, toBasicError } from "@ukdanceblue/common/error";
import { ConcreteError } from "@ukdanceblue/common/error";
import { DatabaseError } from "pg";

import type { PostgresErrorCode } from "./postgresCodes.js";
import { postgresErrorCodes } from "./postgresCodes.js";

export class PostgresError extends ConcreteError {
  public readonly target: string;

  constructor(private readonly error: DatabaseError) {
    super();
    this.target = `${error.schema === "danceblue" ? "" : `${error.schema}.`}${error.table ?? "unknown"}${error.column ? `.${error.column}` : ""}`;
  }

  get message(): string {
    return this.error.message;
  }
  get detailedMessage(): string {
    return `${this.error.message}\n${this.error.detail}`;
  }
  get errorCode(): PostgresErrorCode | undefined {
    return (
      postgresErrorCodes as Record<string, PostgresErrorCode | undefined>
    )[this.error.code ?? ""];
  }
  get expose(): boolean {
    return this.errorCode?.class.sensitive === false;
  }
  readonly tag: ErrorCode.PostgresError = ErrorCode.PostgresError;

  static fromUnknown(error: unknown): PostgresError | BasicError {
    if (error instanceof DatabaseError) {
      return new PostgresError(error);
    }
    return toBasicError(error);
  }
}
