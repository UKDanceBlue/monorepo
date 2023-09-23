import type { Resource } from "@ukdanceblue/common";

import type { AbstractGraphQLArrayOkResponse, AbstractGraphQLOkResponse, GraphQLErrorResponse } from "./ApiResponse.js";
import type { UnfilteredListQueryArgs } from "./ListQueryArgs.js";

export interface ResolverInterface<R extends Resource> {
  getByUuid: (uuid: string) => Promise<AbstractGraphQLOkResponse<R> | GraphQLErrorResponse>;
  delete: (uuid: string) => Promise<AbstractGraphQLOkResponse<boolean> | GraphQLErrorResponse>;

  getAll?: () => Promise<AbstractGraphQLArrayOkResponse<R[]> | GraphQLErrorResponse>;
  list?: <Q extends UnfilteredListQueryArgs>(query: Q) => Promise<AbstractGraphQLArrayOkResponse<R[]> | GraphQLErrorResponse>;
  create?: (input: never) => Promise<AbstractGraphQLOkResponse<R> | GraphQLErrorResponse>;
  replace?: (uuid: string, input: R) => Promise<AbstractGraphQLOkResponse<R> | GraphQLErrorResponse>;
}