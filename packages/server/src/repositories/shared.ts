import type {
  ActionDeniedError,
  BasicError,
  InvariantError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { toBasicError } from "@ukdanceblue/common/error";
import { Err } from "ts-results-es";

import type { PostgresError } from "#error/postgres.js";

/**
 * Either a Primary Key numeric ID or a UUID string
 */
export type SimpleUniqueParam = { id: number } | { uuid: string };
/**
 * The error types that can be returned by most repository functions
 */
export type RepositoryError =
  | ActionDeniedError
  | PostgresError
  | BasicError
  | NotFoundError
  | InvariantError;

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not
 */
export function unwrapRepositoryError(error: unknown): RepositoryError {
  return toBasicError(error);
}

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not (wrapped by Err)
 */
export function handleRepositoryError(error: unknown): Err<RepositoryError> {
  return Err(unwrapRepositoryError(error));
}
