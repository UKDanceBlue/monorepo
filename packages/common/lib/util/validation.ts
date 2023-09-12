export class ValidationError extends TypeError {
  readonly name: string = "ValidationError";
}

export class TypeMismatchError extends ValidationError {
  readonly name: string = "TypeMismatchError";

  constructor(
    readonly expected: string,
    readonly actual: string,
    readonly message = `Expected ${expected}, got ${actual}`
  ) {
    super(message);
  }
}

export class NaNError extends ValidationError {
  readonly name: string = "NaNError";

  constructor(readonly message = "NaN is not a valid number") {
    super(message);
  }
}

export class UnionValidationError extends ValidationError {
  readonly name: string = "UnionValidationError";

  constructor(
    readonly errors: ValidationError[],
    readonly message = "Union validation failed"
  ) {
    super(message);
  }
}
