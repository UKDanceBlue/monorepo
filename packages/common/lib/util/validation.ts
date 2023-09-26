import type { DateTime, Duration, Interval } from "luxon";

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

export class LuxonError extends ValidationError {
  cause: Duration | Interval | DateTime;
  explanation: string | null;

  readonly name: string = "LuxonError";

  constructor(invalidLuxonObject: Duration | Interval | DateTime) {
    if (invalidLuxonObject.isValid || !invalidLuxonObject.invalidReason) {
      throw new Error("Tried to create an error from a valid Luxon object");
    }
    super(invalidLuxonObject.invalidReason);

    this.cause = invalidLuxonObject;
    this.explanation = invalidLuxonObject.invalidExplanation;
  }
}

export class ParsingError extends ValidationError {
  cause?: object;

  readonly name: string = "ParsingError";

  constructor(message: string, cause?: object) {
    super("Error parsing body");

    this.message = message;
    if (cause) {this.cause = cause;}
  }
}
