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
  readonly #message: string = "Unknown error";

  // We use a rest parameter here to detect when undefined is passed. If we just allowed an optional parameter, we wouldn't be able to distinguish between `new UnknownError()` and `new UnknownError(undefined)`.
  constructor(...message: unknown[]) {
    super();
    if (message.length > 0) {
      this.#message = String(message[0]);
    }
  }

  get message(): string {
    return this.#message;
  }

  get expose(): boolean {
    return false;
  }
}
