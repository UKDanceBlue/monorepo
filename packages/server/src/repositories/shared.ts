import type { NotFoundError } from "../lib/error/direct.js";
import type { BasicError } from "../lib/error/error.js";
import type { SomePrismaError } from "../lib/error/prisma.js";

export type SimpleUniqueParam = { id: number } | { uuid: string };
export type RepositoryError = SomePrismaError | BasicError | NotFoundError;
