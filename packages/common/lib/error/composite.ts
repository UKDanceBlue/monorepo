import { ConcreteError } from "./error.js";
import * as ErrorCode from "./errorCode.js";

export class CompositeError<E extends ConcreteError> extends ConcreteError {
  readonly errors: E[];

  constructor(errors: E[]) {
    super();
    this.errors = errors;
  }

  get message(): string {
    return this.errors.map((error) => error.message).join(", ");
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
