/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import type {
  AbstractGraphQLPaginatedResponse,
  GlobalId,
} from "@ukdanceblue/common";
import type { ConcreteResult } from "@ukdanceblue/common/error";
import type { Option } from "ts-results-es";

type ResolverReturnType<N> =
  | Promise<N>
  | Promise<ConcreteResult<N>>
  | N
  | ConcreteResult<N>;
type OptionalResolverReturnType<N> =
  | ResolverReturnType<N>
  | Promise<Option<N>>
  | Promise<ConcreteResult<Option<N>>>
  | Option<N>
  | ConcreteResult<Option<N>>;

export type StandardResolver<
  NodeType,
  NodeName extends string,
  PluralNodeName extends string = `${NodeName}s`,
> = {
  [K in NodeName]?: (
    id: GlobalId,
    ...args: never[]
  ) => OptionalResolverReturnType<NodeType>;
} & {
  [K in `set${Capitalize<NodeName>}`]?: (
    id: GlobalId,
    set: never,
    ...args: never[]
  ) => ResolverReturnType<NodeType>;
} & {
  [K in `create${Capitalize<NodeName>}`]?: (
    create: never,
    ...args: never[]
  ) => ResolverReturnType<NodeType>;
} & {
  [K in `delete${Capitalize<NodeName>}`]?: (
    id: GlobalId,
    ...args: never[]
  ) => ResolverReturnType<NodeType>;
} & {
  [K in PluralNodeName]?: (
    query: never,
    ...args: never[]
  ) => ResolverReturnType<AbstractGraphQLPaginatedResponse<NodeType>>;
} & {
  [K in `getMultiple${Capitalize<PluralNodeName>}`]?: (
    ids: GlobalId[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
} & {
  [K in `create${Capitalize<PluralNodeName>}`]?: (
    createArgs: never[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
} & {
  [K in `delete${Capitalize<PluralNodeName>}`]?: (
    ids: GlobalId[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
} & {
  [K in `set${Capitalize<PluralNodeName>}`]?: (
    setArgs: {
      id: GlobalId;
      set: never;
    }[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
} & {
  set?: never;
  get?: never;
  update?: never;
  create?: never;
  delete?: never;
};
