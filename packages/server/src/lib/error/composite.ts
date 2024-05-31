import { ConcreteError } from "./error.js";

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
}
