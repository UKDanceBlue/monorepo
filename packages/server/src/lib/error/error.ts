export abstract class ConcreteError {
  abstract get message(): string;
  abstract get expose(): boolean;
  get stack(): string | undefined {
    return undefined;
  }
}

export class JsError extends ConcreteError {
  readonly error: Error;

  constructor(error: Error) {
    super();
    this.error = error;
  }

  get message(): string {
    return this.error.message;
  }

  get expose(): boolean {
    return false;
  }

  get stack(): string | undefined {
    return this.error.stack;
  }
}

export class UnknownError extends ConcreteError {
  get message(): string {
    return "Unknown error";
  }

  get expose(): boolean {
    return false;
  }
}
