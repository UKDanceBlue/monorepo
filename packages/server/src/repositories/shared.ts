import { Err } from "ts-results-es";

import type { NotFoundError } from "../lib/error/direct.js";
import type { BasicError } from "../lib/error/error.js";
import { toBasicError } from "../lib/error/error.js";
import type { SomePrismaError } from "../lib/error/prisma.js";
import { toPrismaError } from "../lib/error/prisma.js";

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
