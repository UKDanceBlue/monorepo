import type { ClassType } from "type-graphql";
import { Field, ObjectType, createUnionType, registerEnumType } from "type-graphql";

import type { ApiError, BaseResponse, CreatedApiResponse, ErrorApiResponse, OkApiResponse, PaginatedApiResponse } from "../../response/JsonResponse.js";
import { ClientAction } from "../../response/JsonResponse.js";
import { VoidScalar } from "../custom-scalars/VoidScalar.js";

registerEnumType(ClientAction, { name: "ClientAction", description: "Actions that the client MUST take if specified" });

@ObjectType({ description: "API response" })
export class GraphQLBaseResponse implements BaseResponse {
  @Field(() => Boolean, { description: "Whether the operation was successful" })
  ok!: boolean;

  @Field(() => [ClientAction], { nullable: true, description: "Client actions to perform" })
  clientActions?: ClientAction[];

  toJson(): BaseResponse {
    const baseResponse: BaseResponse = {
      ok: this.ok,
    };
    if (this.clientActions != null) baseResponse.clientActions = this.clientActions;
    return baseResponse;
  }
}

@ObjectType({ description: "API response" })
export abstract class AbstractGraphQLOkResponse<T> extends GraphQLBaseResponse implements OkApiResponse<T> {
  ok!: true;
  data?: T;

  toJson(): OkApiResponse<T> {
    const baseResponse: OkApiResponse<T> = {
      ok: this.ok,
    };
    if (this.clientActions != null) baseResponse.clientActions = this.clientActions;
    if (this.data != null) baseResponse.data = this.data;
    return baseResponse;
  }

  static newOk<T, R extends AbstractGraphQLOkResponse<T>>(this: ClassType<R>, data?: T): R {
    const response = new this();
    response.ok = true;
    if (data != null) response.data = data;
    return response;
  }
}

export function defineGraphQlOkResponse<T extends object>(name: string, type?: ClassType<T>) {
  @ObjectType(name, { description: "API response" })
  class GraphQLOkResponse extends AbstractGraphQLOkResponse<T> {
    ok!: true;

    @Field(() => type ?? VoidScalar, { nullable: true, description: "The payload of the response" })
    data?: T;
  }
  return GraphQLOkResponse;
}

@ObjectType({ description: "API response" })
export abstract class AbstractGraphQLArrayOkResponse<T> extends AbstractGraphQLOkResponse<T[]> implements OkApiResponse<T[]> {
  toJson(): OkApiResponse<T[]> {
    const baseResponse: OkApiResponse<T[]> = {
      ok: this.ok,
    };
    if (this.clientActions != null) baseResponse.clientActions = this.clientActions;
    if (this.data != null) baseResponse.data = this.data;
    return baseResponse;
  }
}

export function defineGraphQLArrayOkResponse<T extends object>(name: string, type: ClassType<T>) {
  @ObjectType(name, { description: "API response" })
  class GraphQLArrayOkResponse extends AbstractGraphQLArrayOkResponse<T> {
    ok!: true;

    @Field(() => [type], { nullable: true, description: "The payload of the response" })
    data?: T[];
  }
  return GraphQLArrayOkResponse;
}

@ObjectType({ description: "API response" })
export abstract class AbstractGraphQLCreatedResponse<T> extends AbstractGraphQLOkResponse<T> implements CreatedApiResponse<T> {
  uuid!: string;

  toJson(): CreatedApiResponse<T> {
    const baseResponse: CreatedApiResponse<T> = {
      ok: this.ok,
      uuid: this.uuid,
    };
    if (this.clientActions != null) baseResponse.clientActions = this.clientActions;
    if (this.data != null) baseResponse.data = this.data;
    return baseResponse;
  }
}

export function defineGraphQlCreatedResponse<T extends object>(name: string, type: ClassType<T>) {
  @ObjectType(name, { description: "API response" })
  class GraphQLCreatedResponse extends AbstractGraphQLCreatedResponse<T> {
    ok!: true;

    @Field(() => String, { description: "The UUID of the created resource" })
    uuid!: string;

    @Field(() => type, { nullable: true, description: "The payload of the response" })
    data?: T;
  }
  return GraphQLCreatedResponse;
}

@ObjectType({ description: "API response" })
export abstract class AbstractGraphQLPaginatedResponse<T> extends AbstractGraphQLOkResponse<T[]> {
  total!: number;
  pageSize!: number;
  page!: number;

  toJson(): PaginatedApiResponse<T> {
    const baseResponse: PaginatedApiResponse<T> = {
      ok: this.ok,
      pagination: {
        total: this.total,
        pageSize: this.pageSize,
        page: this.page,
      },
    };
    if (this.clientActions != null) baseResponse.clientActions = this.clientActions;
    if (this.data != null) baseResponse.data = this.data;
    return baseResponse;
  }
}

export function defineGraphQlPaginatedResponse<T extends object>(name: string, type: ClassType<T>) {
  @ObjectType(name, { description: "API response" })
  class GraphQLPaginatedResponse extends AbstractGraphQLPaginatedResponse<T> {
    ok!: true;

    @Field(() => [type], { nullable: true, description: "The payload of the response" })
    data?: T[];

    @Field(() => Number, { description: "The total number of items" })
    total!: number;

    @Field(() => Number, { description: "The number of items per page" })
    pageSize!: number;

    @Field(() => Number, { description: "The current page number (1-indexed)" })
    page!: number;
  }
  return GraphQLPaginatedResponse;
}

@ObjectType({ description: "API response" })
export class GraphQLErrorResponse extends GraphQLBaseResponse {
  ok!: false;

  @Field(() => String, { description: "The error message" })
  message!: string;

  @Field(() => String, { description: "Error details, explains the problem, but not for end users", nullable: true })
  details?: string;

  @Field(() => String, { description: "Error explanation, can be shown to end users", nullable: true })
  explanation?: string;

  @Field(() => String, { description: "Cause of the error, if any. May contain sensitive information", nullable: true })
  cause?: string;

  toJson(): ErrorApiResponse {
    const baseResponse: ErrorApiResponse = {
      ok: this.ok,
      errorMessage: this.message,
    };
    if (this.clientActions != null) baseResponse.clientActions = this.clientActions;
    if (this.details != null) baseResponse.errorDetails = this.details;
    if (this.explanation != null) baseResponse.errorExplanation = this.explanation;
    return baseResponse;
  }

  static from(val: Error | string | ApiError): GraphQLErrorResponse {
    const response = new GraphQLErrorResponse();
    if (typeof val === "string") {
      response.message = val;
      return response;
    } else if (val instanceof Error) {
      response.message = val.message;
      if (val.stack) response.cause = val.stack;
      return response;
    } else {
      response.message = val.errorMessage;
      if (val.errorDetails) response.details = val.errorDetails;
      if (val.errorExplanation) response.explanation = val.errorExplanation;
      if (val.errorCause) response.cause = typeof val.errorCause === "string" ? val.errorCause : JSON.stringify(val.errorCause);
      return response;
    }
  }
}

export function withGraphQLErrorUnion<R extends GraphQLBaseResponse>(type: ClassType<R>, typeName?: string) {
  const unionType = createUnionType({
    name: `${typeName ?? type.name}OrError`,
    types: () => [type, GraphQLErrorResponse] as const,
    // resolveType: (value) => {
    //   if (!("ok" in value)) {
    //     return undefined;
    //   } else if (value.ok) {
    //     return type;
    //   } else if ("message" in value) {
    //     return GraphQLErrorResponse;
    //   } else {
    //     return undefined;
    //   }
    // }
  });
  return unionType;
}
