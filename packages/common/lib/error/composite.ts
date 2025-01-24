import { ExtendedError } from "./error.js";
import * as ErrorCode from "./errorCode.js";

export class CompositeError<E extends ExtendedError> extends ExtendedError {
  constructor(public readonly errors: readonly E[]) {
    super(
      errors.map((error) => error.message).join(", "),
      ErrorCode.CompositeError.description
    );
  }

  get detailedMessage(): string {
    return this.errors.map((error) => error.detailedMessage).join(", ");
  }

  get expose(): boolean {
    return this.errors.every((error) => error.expose);
  }

  get tag(): ErrorCode.CompositeError {
    return ErrorCode.CompositeError;
  }
}
