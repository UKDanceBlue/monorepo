import type { Resource } from "@ukdanceblue/common";

import type {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
import type { UnfilteredListQueryArgs } from "./ListQueryArgs.js";

export interface ResolverInterface<R extends Resource> {
  getByUuid: (uuid: string) => Promise<AbstractGraphQLOkResponse<R>>;
  delete: (uuid: string) => Promise<AbstractGraphQLOkResponse<boolean>>;

  getAll?: () => Promise<AbstractGraphQLArrayOkResponse<R>>;
  list?: <Q extends UnfilteredListQueryArgs>(
    query: Q
  ) => Promise<AbstractGraphQLPaginatedResponse<R>>;
  create?: (input: never) => Promise<AbstractGraphQLCreatedResponse<R>>;
  replace?: (uuid: string, input: R) => Promise<AbstractGraphQLOkResponse<R>>;
}
