import type {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

import { ConcreteError } from "./error.js";

type RawPrismaError =
  | PrismaClientKnownRequestError
  | PrismaClientUnknownRequestError
  | PrismaClientRustPanicError
  | PrismaClientInitializationError
  | PrismaClientValidationError;

export abstract class PrismaError extends ConcreteError {
  readonly error: RawPrismaError;

  constructor(error: RawPrismaError) {
    super();
    this.error = error;
  }

  get message(): string {
    return this.error.message;
  }

  get stack(): string | undefined {
    return this.error.stack;
  }

  get expose(): boolean {
    return false;
  }
}

export class PrismaKnownRequestError extends PrismaError {
  readonly error: PrismaClientKnownRequestError;

  constructor(error: PrismaClientKnownRequestError) {
    super(error);
    this.error = error;
  }
}

export class PrismaUnknownRequestError extends PrismaError {
  readonly error: PrismaClientUnknownRequestError;

  constructor(error: PrismaClientUnknownRequestError) {
    super(error);
    this.error = error;
  }
}

export class PrismaRustPanicError extends PrismaError {
  readonly error: PrismaClientRustPanicError;

  constructor(error: PrismaClientRustPanicError) {
    super(error);
    this.error = error;
  }
}

export class PrismaInitializationError extends PrismaError {
  readonly error: PrismaClientInitializationError;

  constructor(error: PrismaClientInitializationError) {
    super(error);
    this.error = error;
  }
}

export class PrismaValidationError extends PrismaError {
  readonly error: PrismaClientValidationError;

  constructor(error: PrismaClientValidationError) {
    super(error);
    this.error = error;
  }
}
