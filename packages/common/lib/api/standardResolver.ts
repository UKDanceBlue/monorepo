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

export type CrudResolver<
  NodeType,
  NodeName extends string,
  PluralNodeName extends string = `${NodeName}s`,
> =
  // Get One
  {
    [K in NodeName]: (
      id: GlobalId,
      ...args: never[]
    ) => OptionalResolverReturnType<NodeType>;
  } & { // Set One
    [K in `set${Capitalize<NodeName>}`]?: (
      id: GlobalId,
      set: never,
      ...args: never[]
    ) => ResolverReturnType<NodeType>;
  } & { // Create One
    [K in `create${Capitalize<NodeName>}`]?: (
      create: never,
      ...args: never[]
    ) => ResolverReturnType<NodeType>;
  } & { // Delete One
    [K in `delete${Capitalize<NodeName>}`]?: (
      id: GlobalId,
      ...args: never[]
    ) => ResolverReturnType<NodeType>;
  } & { // Get List
    [K in PluralNodeName]?: (
      query: never,
      ...args: never[]
    ) => ResolverReturnType<AbstractGraphQLPaginatedResponse<NodeType>>;
  } & { // Get All
    [K in `all${Capitalize<PluralNodeName>}`]?: (
      ...args: never[]
    ) => ResolverReturnType<NodeType[]>;
  } & { // Get Multiple
    [K in `getMultiple${Capitalize<PluralNodeName>}`]?: (
      ids: GlobalId[],
      ...args: never[]
    ) => ResolverReturnType<NodeType[]>;
  } & { // Create Multiple
    [K in `create${Capitalize<PluralNodeName>}`]?: (
      createArgs: never[],
      ...args: never[]
    ) => ResolverReturnType<NodeType[]>;
  } & { // Delete Multiple
    [K in `delete${Capitalize<PluralNodeName>}`]?: (
      ids: GlobalId[],
      ...args: never[]
    ) => ResolverReturnType<NodeType[]>;
  } & { // Update Multiple
    [K in `set${Capitalize<PluralNodeName>}`]?: (
      setArgs: {
        id: GlobalId;
        set: never;
      }[],
      ...args: never[]
    ) => ResolverReturnType<NodeType[]>;
  } & // Banned operation names
  {
    set?: never;
    get?: never;
    getByUuid?: never;
    update?: never;
    create?: never;
    delete?: never;
    list?: never;
  } & {
    [K in `list${Capitalize<PluralNodeName>}`]?: never;
  };
