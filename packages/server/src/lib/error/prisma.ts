import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  ErrorCode,
  ErrorType,
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
  constructor(prismaError: RawPrismaError, message?: string) {
    super(message ?? prismaError.message, ErrorCode.PrismaError.description);
    this.stack = prismaError.stack;
    this.cause = prismaError;
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get expose() {
    return false;
  }

  get tag(): ErrorCode.PrismaError {
    return ErrorCode.PrismaError;
  }
}

export class PrismaKnownRequestError extends PrismaError {
  declare cause: PrismaClientKnownRequestError;

  private readonly isClientError: boolean;

  constructor(error: PrismaClientKnownRequestError) {
    super(error, error.meta?.message ? String(error.meta.message) : undefined);
    this.cause = error;

    switch (error.code) {
      case "P2000":
      case "P2001":
      case "P2002":
      case "P2003":
      case "P2004":
      case "P2019":
      case "P2020":
      case "P2025": {
        this.isClientError = true;
        break;
      }
      default: {
        this.isClientError = false;
        break;
      }
    }
  }

  get expose() {
    return this.isClientError;
  }

  get type() {
    return this.isClientError ? ErrorType.BadRequest : ErrorType.Internal;
  }

  get detailedMessage(): string {
    return this.cause.message;
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
