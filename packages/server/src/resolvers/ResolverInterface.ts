import type { Resource } from "@ukdanceblue/common";

import type {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
import type {
  FilteredListQueryArgs,
  UnfilteredListQueryArgs,
} from "./ListQueryArgs.js";

export interface ResolverInterface<R extends Resource> {
  getByUuid: (uuid: string) => Promise<AbstractGraphQLOkResponse<R>>;
  delete: (uuid: string) => Promise<AbstractGraphQLOkResponse<boolean>>;

  getAll?: () => Promise<AbstractGraphQLArrayOkResponse<R>>;
  listAll?: <Q extends UnfilteredListQueryArgs>(
    query: Q
  ) => Promise<AbstractGraphQLPaginatedResponse<R>>;
  list?: <
    AllKeys extends string,
    StringFilterKeys extends AllKeys,
    NumericFilterKeys extends AllKeys,
    DateFilterKeys extends AllKeys,
    BooleanFilterKeys extends AllKeys,
    Q extends FilteredListQueryArgs<
      AllKeys,
      StringFilterKeys,
      NumericFilterKeys,
      DateFilterKeys,
      BooleanFilterKeys
    >
  >(
    query: Q
  ) => Promise<AbstractGraphQLPaginatedResponse<R>>;
  create?: (input: never) => Promise<AbstractGraphQLCreatedResponse<R>>;
  replace?: (uuid: string, input: R) => Promise<AbstractGraphQLOkResponse<R>>;
}
