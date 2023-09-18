import type { ApiError } from "../../response/JsonResponse.js";
import { GraphQLErrorResponse } from "../object-types/ApiResponse.js";
import type { AbstractGraphQLCreatedResponse, AbstractGraphQLOkResponse } from "../object-types/ApiResponse.js";
import { Resource } from "../object-types/Resource.js";

export function resolverCreateHelper<R extends Resource, Resp extends AbstractGraphQLCreatedResponse<{ data?: R; uuid: string; }>, E extends boolean>(responseClass: {
  newOk: (data: { data?: R; uuid: string; }) => Resp;
}, result: ApiError<E> | {
  data?: R;
  uuid: string;
}) {
  if (result instanceof GraphQLErrorResponse) {
    return result;
  } else if (!("uuid" in result)) {
    return GraphQLErrorResponse.from(result);
  } else {
    const response = responseClass.newOk(result);
    response.uuid = result.uuid;
    return response;
  }
}

export function resolverSetHelper<R extends Resource, Resp extends AbstractGraphQLOkResponse<R>, E extends boolean>(responseClass: {
  newOk: (data: R) => Resp;
}, result: ApiError<E> | R) {
  if (result instanceof GraphQLErrorResponse) {
    return result;
  } else if (!(result instanceof Resource)) {
    return GraphQLErrorResponse.from(result);
  } else {
    return responseClass.newOk(result);
  }
}
