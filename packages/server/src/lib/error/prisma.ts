import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { ConcreteError } from "@ukdanceblue/common/error";
import type { Option } from "ts-results-es";
import { None, Some } from "ts-results-es";

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

export function toPrismaError(error: RawPrismaError): Some<SomePrismaError>;
export function toPrismaError(error: unknown): Option<SomePrismaError>;
export function toPrismaError(error: unknown): Option<SomePrismaError> {
  if (error instanceof PrismaClientInitializationError) {
    return Some(new PrismaInitializationError(error));
  }
  if (error instanceof PrismaClientKnownRequestError) {
    return Some(new PrismaKnownRequestError(error));
  }
  if (error instanceof PrismaClientRustPanicError) {
    return Some(new PrismaRustPanicError(error));
  }
  if (error instanceof PrismaClientUnknownRequestError) {
    return Some(new PrismaUnknownRequestError(error));
  }
  if (error instanceof PrismaClientValidationError) {
    return Some(new PrismaValidationError(error));
  }
  return None;
}
