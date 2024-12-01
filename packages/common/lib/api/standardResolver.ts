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

interface CrudOperations<NodeType> {
  getOne: (
    id: GlobalId,
    ...args: never[]
  ) => OptionalResolverReturnType<NodeType>;
  setOne: (
    id: GlobalId,
    set: never,
    ...args: never[]
  ) => ResolverReturnType<NodeType>;
  createOne: (create: never, ...args: never[]) => ResolverReturnType<NodeType>;
  deleteOne: (id: GlobalId, ...args: never[]) => ResolverReturnType<NodeType>;
  getList: (
    query: never,
    ...args: never[]
  ) => ResolverReturnType<AbstractGraphQLPaginatedResponse<NodeType>>;
  getAll: (...args: never[]) => ResolverReturnType<NodeType[]>;
  getMultiple: (
    ids: GlobalId[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
  createMultiple: (
    createArgs: never[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
  deleteMultiple: (
    ids: GlobalId[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
  updateMultiple: (
    setArgs: {
      id: GlobalId;
      set: never;
    }[],
    ...args: never[]
  ) => ResolverReturnType<NodeType[]>;
}

export type CrudResolver<
  NodeType,
  NodeName extends string,
  PluralNodeName extends string = `${NodeName}s`,
> =
  // Get One
  {
    [K in NodeName]: CrudOperations<NodeType>["getOne"];
  } & {
    // Set One
    [K in `set${Capitalize<NodeName>}`]?: CrudOperations<NodeType>["setOne"];
  } & {
    // Create One
    [K in `create${Capitalize<NodeName>}`]?: CrudOperations<NodeType>["createOne"];
  } & {
    // Delete One
    [K in `delete${Capitalize<NodeName>}`]?: CrudOperations<NodeType>["deleteOne"];
  } & {
    // Get List
    [K in PluralNodeName]?: CrudOperations<NodeType>["getList"];
  } & {
    // Get All
    [K in `all${Capitalize<PluralNodeName>}`]?: CrudOperations<NodeType>["getAll"];
  } & {
    // Get Multiple
    [K in `getMultiple${Capitalize<PluralNodeName>}`]?: CrudOperations<NodeType>["getMultiple"];
  } & {
    // Create Multiple
    [K in `create${Capitalize<PluralNodeName>}`]?: CrudOperations<NodeType>["createMultiple"];
  } & {
    // Delete Multiple
    [K in `delete${Capitalize<PluralNodeName>}`]?: CrudOperations<NodeType>["deleteMultiple"];
  } & {
    // Update Multiple
    [K in `set${Capitalize<PluralNodeName>}`]?: CrudOperations<NodeType>["updateMultiple"];
  } & {
    // Banned operation names
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

function capitalize<S extends string>(s: S): Capitalize<S> {
  return (s[0]!.toUpperCase() + s.slice(1)) as Capitalize<S>;
}

export function getCrudOperationNames<
  NodeName extends string,
  PluralNodeName extends string,
>(
  nodeName: NodeName,
  pluralNodeName: PluralNodeName
): {
  getOne: NodeName;
  setOne: `set${Capitalize<NodeName>}`;
  createOne: `create${Capitalize<NodeName>}`;
  deleteOne: `delete${Capitalize<NodeName>}`;
  getList: PluralNodeName;
  getAll: `all${Capitalize<PluralNodeName>}`;
  getMultiple: `getMultiple${Capitalize<PluralNodeName>}`;
  createMultiple: `create${Capitalize<PluralNodeName>}`;
  deleteMultiple: `delete${Capitalize<PluralNodeName>}`;
  updateMultiple: `set${Capitalize<PluralNodeName>}`;
} {
  const capitalizedNodeName = capitalize(nodeName);
  const capitalizedPluralNodeName = capitalize(pluralNodeName);

  return {
    getOne: nodeName,
    setOne: `set${capitalizedNodeName}` as const,
    createOne: `create${capitalizedNodeName}` as const,
    deleteOne: `delete${capitalizedNodeName}` as const,
    getList: pluralNodeName,
    getAll: `all${capitalizedPluralNodeName}` as const,
    getMultiple: `getMultiple${capitalizedPluralNodeName}` as const,
    createMultiple: `create${capitalizedPluralNodeName}` as const,
    deleteMultiple: `delete${capitalizedPluralNodeName}` as const,
    updateMultiple: `set${capitalizedPluralNodeName}` as const,
  };
}
