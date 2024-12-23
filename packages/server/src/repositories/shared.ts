import type {
  ActionDeniedError,
  BasicError,
  InvariantError,
  NotFoundError,
} from "@ukdanceblue/common/error";
import { toBasicError } from "@ukdanceblue/common/error";
import { Err, Some } from "ts-results-es";

import type { ParsedDrizzleError } from "#error/drizzle.js";
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
  | ActionDeniedError
  | SomePrismaError
  | ParsedDrizzleError
  | BasicError
  | NotFoundError
  | InvariantError;

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not
 */
export function unwrapRepositoryError(error: unknown): RepositoryError {
  const prismaError = toPrismaError(error);
  return prismaError.orElse(() => Some(toBasicError(error))).unwrap();
}

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not (wrapped by Err)
 */
export function handleRepositoryError(error: unknown): Err<RepositoryError> {
  return Err(unwrapRepositoryError(error));
}
