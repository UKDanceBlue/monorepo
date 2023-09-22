import type { Resource } from "@ukdanceblue/common";

import type { AbstractGraphQLArrayOkResponse, AbstractGraphQLOkResponse, GraphQLErrorResponse } from "./ApiResponse.js";

export interface ResolverInterface<T extends Resource> {
  getByUuid: (uuid: string) => Promise<AbstractGraphQLOkResponse<T> | GraphQLErrorResponse>;
  delete: (uuid: string) => Promise<AbstractGraphQLOkResponse<boolean> | GraphQLErrorResponse>;

  getAll?: () => Promise<AbstractGraphQLArrayOkResponse<T[]> | GraphQLErrorResponse>;
  create?: (input: never) => Promise<AbstractGraphQLOkResponse<T> | GraphQLErrorResponse>;
  replace?: (uuid: string, input: T) => Promise<AbstractGraphQLOkResponse<T> | GraphQLErrorResponse>;
}