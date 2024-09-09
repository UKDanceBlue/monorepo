import { toPrismaError } from "#error/prisma.js";

import { toBasicError } from "@ukdanceblue/common/error";
import { Err } from "ts-results-es";

import type { SomePrismaError } from "#error/prisma.js";
import type { NotFoundError, BasicError } from "@ukdanceblue/common/error";

export type SimpleUniqueParam = { id: number } | { uuid: string };
export type RepositoryError = SomePrismaError | BasicError | NotFoundError;

export function unwrapRepositoryError(
  error: unknown
): SomePrismaError | BasicError {
  const prismaError = toPrismaError(error);
  return prismaError.isSome() ? prismaError.unwrap() : toBasicError(error);
}

export function handleRepositoryError(
  error: unknown
): Err<SomePrismaError | BasicError> {
  return Err(unwrapRepositoryError(error));
}
