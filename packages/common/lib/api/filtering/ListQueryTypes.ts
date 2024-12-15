import { registerEnumType } from "type-graphql";

export const SortDirection = {
  asc: "asc",
  desc: "desc",
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

registerEnumType(SortDirection, { name: "SortDirection" });

export const DEFAULT_PAGE_SIZE = 10;
export const FIRST_PAGE = 1;
