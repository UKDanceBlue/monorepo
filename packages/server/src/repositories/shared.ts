import type {
  ActionDeniedError,
  BasicError,
  CompositeError,
  InvalidArgumentError,
  InvalidOperationError,
  InvariantError,
  LuxonError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { toBasicError } from "@ukdanceblue/common/error";
import { type AsyncResult, Err, type Result, Some } from "ts-results-es";

import type { SomePrismaError } from "#error/prisma.js";
import { toPrismaError } from "#error/prisma.js";

/**
 * Either a Primary Key numeric ID or a UUID string
 */
export type SimpleUniqueParam = { id: number } | { uuid: string };
/**
 * The error types that can be returned by most repository functions
 */
export type RepositoryError =
  | SomePrismaError
  | BasicError
  | NotFoundError
  | ActionDeniedError
  | InvariantError
  | InvalidArgumentError
  | InvalidOperationError
  | LuxonError
  | CompositeError<RepositoryError>;

export type RepositoryResult<T, E = never> = Result<T, RepositoryError | E>;
export type AsyncRepositoryResult<T, E = never> = AsyncResult<
  T,
  RepositoryError | E
>;

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not
 */
export function unwrapRepositoryError(error: unknown): RepositoryError {
  const prismaError = toPrismaError(error);
  return prismaError
    .orElse(() => Some(toBasicError(error)))
    .expect("Error should be a BasicError");
}

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not (wrapped by Err)
 */
export function handleRepositoryError(error: unknown): Err<RepositoryError> {
  return Err(unwrapRepositoryError(error));
}
