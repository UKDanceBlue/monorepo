import type {
  AbstractFilteredListQueryArgs,
  Resource,
  UnfilteredListQueryArgs,
} from "@ukdanceblue/common";

import type {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

export interface ResolverInterface<R extends Resource> {
  getByUuid?: (
    uuid: string,
    ...params: never[]
  ) => Promise<AbstractGraphQLOkResponse<R | null>>;
  delete?: (
    uuid: string,
    ...params: never[]
  ) => Promise<AbstractGraphQLOkResponse<boolean>>;

  getAll?: (...params: never[]) => Promise<AbstractGraphQLArrayOkResponse<R>>;
  create?: (
    input: never,
    ...params: never[]
  ) => Promise<AbstractGraphQLCreatedResponse<R>>;
  replace?: (
    uuid: string,
    input: R,
    ...params: never[]
  ) => Promise<AbstractGraphQLOkResponse<R>>;
}

export interface ResolverInterfaceWithList<
  R extends Resource,
  Q extends UnfilteredListQueryArgs<string>,
> {
  list?: (
    query: Q,
    ...params: never[]
  ) => Promise<AbstractGraphQLPaginatedResponse<R>>;
}

export interface ResolverInterfaceWithFilteredList<
  R extends Resource,
  Q extends AbstractFilteredListQueryArgs<
    string,
    string,
    string,
    string,
    string
  >,
> extends ResolverInterfaceWithList<R, Q> {
  list?: (
    query: Q,
    ...params: never[]
  ) => Promise<AbstractGraphQLPaginatedResponse<R>>;
}
