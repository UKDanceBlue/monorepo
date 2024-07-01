import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Maybe } from "true-myth";
import type { Just } from "true-myth/maybe";

import { ConcreteError } from "./error.js";

type RawPrismaError =
  | PrismaClientKnownRequestError
  | PrismaClientUnknownRequestError
  | PrismaClientRustPanicError
  | PrismaClientInitializationError
  | PrismaClientValidationError;

const PrismaErrorTag = Symbol("PrismaError");
type PrismaErrorTag = typeof PrismaErrorTag;
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

  static get Tag(): PrismaErrorTag {
    return PrismaErrorTag;
  }
  get tag(): PrismaErrorTag {
    return PrismaErrorTag;
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

export type SomePrismaError =
  | PrismaInitializationError
  | PrismaKnownRequestError
  | PrismaRustPanicError
  | PrismaUnknownRequestError
  | PrismaValidationError;

export function toPrismaError(error: RawPrismaError): Just<SomePrismaError>;
export function toPrismaError(error: unknown): Maybe<SomePrismaError>;
export function toPrismaError(error: unknown): Maybe<SomePrismaError> {
  if (error instanceof PrismaClientInitializationError) {
    return Maybe.of(new PrismaInitializationError(error));
  }
  if (error instanceof PrismaClientKnownRequestError) {
    return Maybe.of(new PrismaKnownRequestError(error));
  }
  if (error instanceof PrismaClientRustPanicError) {
    return Maybe.of(new PrismaRustPanicError(error));
  }
  if (error instanceof PrismaClientUnknownRequestError) {
    return Maybe.of(new PrismaUnknownRequestError(error));
  }
  if (error instanceof PrismaClientValidationError) {
    return Maybe.of(new PrismaValidationError(error));
  }
  return Maybe.nothing();
}
