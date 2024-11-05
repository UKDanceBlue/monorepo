import type { BasicError, NotFoundError } from "@ukdanceblue/common/error";
import { toBasicError } from "@ukdanceblue/common/error";
import { Err } from "ts-results-es";

import type { SomePrismaError } from "#error/prisma.js";
import { toPrismaError } from "#error/prisma.js";

/**
 * Either a Primary Key numeric ID or a UUID string
 */
export type SimpleUniqueParam = { id: number } | { uuid: string };
/**
 * The error types that can be returned by most repository functions
 */
export type RepositoryError = SomePrismaError | BasicError | NotFoundError;

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not
 */
export function unwrapRepositoryError(
  error: unknown
): SomePrismaError | BasicError {
  const prismaError = toPrismaError(error);
  return prismaError.isSome() ? prismaError.unwrap() : toBasicError(error);
}

/**
 * Takes in an arbitrary error and returns a PrismaError subclass if it is a Prisma error, or a BasicError if it is not (wrapped by Err)
 */
export function handleRepositoryError(
  error: unknown
): Err<SomePrismaError | BasicError> {
  return Err(unwrapRepositoryError(error));
}
