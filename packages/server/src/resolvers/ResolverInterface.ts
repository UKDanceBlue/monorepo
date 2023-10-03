import type { Resource } from "@ukdanceblue/common";

import type {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
import type {
  AbstractFilteredListQueryArgs,
  UnfilteredListQueryArgs,
} from "./ListQueryArgs.js";

export interface ResolverInterface<R extends Resource> {
  getByUuid: (uuid: string) => Promise<AbstractGraphQLOkResponse<R>>;
  delete: (uuid: string) => Promise<AbstractGraphQLOkResponse<boolean>>;

  getAll?: () => Promise<AbstractGraphQLArrayOkResponse<R>>;
  create?: (input: never) => Promise<AbstractGraphQLCreatedResponse<R>>;
  replace?: (uuid: string, input: R) => Promise<AbstractGraphQLOkResponse<R>>;
}

export interface ResolverInterfaceWithList<
  R extends Resource,
  Q extends UnfilteredListQueryArgs<string>,
> {
  list?: (query: Q) => Promise<AbstractGraphQLPaginatedResponse<R>>;
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
  list?: (query: Q) => Promise<AbstractGraphQLPaginatedResponse<R>>;
}
