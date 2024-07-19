import type { NotFoundError, BasicError } from "@ukdanceblue/common/error";
import { toBasicError } from "@ukdanceblue/common/error";
import { Err } from "ts-results-es";
import { toPrismaError } from "#error/prisma.js";
import type { SomePrismaError } from "#error/prisma.js";

export type SimpleUniqueParam = { id: number } | { uuid: string };
export type RepositoryError = SomePrismaError | BasicError | NotFoundError;

export function handleRepositoryError(
  error: unknown
): Err<SomePrismaError | BasicError> {
  const prismaError = toPrismaError(error);
  return prismaError.isSome()
    ? Err(prismaError.unwrap())
    : Err(toBasicError(error));
}
