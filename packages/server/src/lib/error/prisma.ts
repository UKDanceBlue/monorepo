import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  ErrorCode,
  ExtendedError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import type { Option } from "ts-results-es";
import { None, Some } from "ts-results-es";

import type { RepositoryError } from "#repositories/shared.js";

type RawPrismaError =
  | PrismaClientKnownRequestError
  | PrismaClientUnknownRequestError
  | PrismaClientRustPanicError
  | PrismaClientInitializationError
  | PrismaClientValidationError;

export abstract class PrismaError extends ExtendedError {
  declare cause: RawPrismaError;
  constructor(prismaError: RawPrismaError) {
    super(prismaError.message, ErrorCode.PrismaError.description);
    this.stack = prismaError.stack;
    this.cause = prismaError;
  }

  readonly expose = false;

  get tag(): ErrorCode.PrismaError {
    return ErrorCode.PrismaError;
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

export function toPrismaError(error: RawPrismaError): Some<RepositoryError>;
export function toPrismaError(error: unknown): Option<RepositoryError>;
export function toPrismaError(error: unknown): Option<RepositoryError> {
  if (error instanceof PrismaClientInitializationError) {
    return Some(new PrismaInitializationError(error));
  }
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return Some(new NotFoundError());
    }
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
