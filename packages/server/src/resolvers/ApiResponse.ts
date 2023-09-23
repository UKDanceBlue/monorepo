import type { ApiError, BaseResponse, CreatedApiResponse, ErrorApiResponse, OkApiResponse, PaginatedApiResponse } from "@ukdanceblue/common";
import { ClientAction, ErrorCode, VoidScalar } from "@ukdanceblue/common";
import type { ClassType } from "type-graphql";
import { ArgsType, Field, InterfaceType, ObjectType, createUnionType, registerEnumType } from "type-graphql";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./ListQueryArgs.js";

registerEnumType(ClientAction, { name: "ClientAction", description: "Actions that the client MUST take if specified" });

@InterfaceType({ description: "API response" })
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

@InterfaceType({ description: "API response", implements: GraphQLBaseResponse })
export abstract class AbstractGraphQLOkResponse<T> extends GraphQLBaseResponse implements OkApiResponse<T> {
  @Field(() => Boolean, { description: "Whether the operation was successful", defaultValue: true })
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

  static newOk<T, OkRes extends AbstractGraphQLOkResponse<T>>(this: ClassType<OkRes>, data?: T): OkRes {
    const response = new this();
    response.ok = true;
    if (data != null) response.data = data;
    return response;
  }
}

/**
 *
 * @param name
 * @param type
 */
export function defineGraphQlOkResponse<T extends object>(name: string, type?: ClassType<T>) {
  @ObjectType(name, { description: "API response", implements: AbstractGraphQLOkResponse })
  class GraphQLOkResponse extends AbstractGraphQLOkResponse<T> {
    @Field(() => Boolean, { description: "Whether the operation was successful", defaultValue: true })
    ok!: true;

    @Field(() => type ?? VoidScalar, { nullable: true, description: "The payload of the response" })
    data?: T;
  }
  return GraphQLOkResponse;
}

@InterfaceType({ description: "API response", implements: GraphQLBaseResponse })
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

/**
 *
 * @param name
 * @param type
 */
export function defineGraphQLArrayOkResponse<T extends object>(name: string, type: ClassType<T>) {
  @ObjectType(name, { description: "API response", implements: AbstractGraphQLArrayOkResponse })
  class GraphQLArrayOkResponse extends AbstractGraphQLArrayOkResponse<T> {
    @Field(() => Boolean, { description: "Whether the operation was successful", defaultValue: true })
    ok!: true;

    @Field(() => [type], { nullable: true, description: "The payload of the response" })
    data?: T[];
  }
  return GraphQLArrayOkResponse;
}

@InterfaceType({ description: "API response", implements: AbstractGraphQLOkResponse })
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

/**
 *
 * @param name
 * @param type
 */
export function defineGraphQlCreatedResponse<T extends object>(name: string, type: ClassType<T>) {
  @ObjectType(name, { description: "API response", implements: AbstractGraphQLCreatedResponse })
  class GraphQLCreatedResponse extends AbstractGraphQLCreatedResponse<T> {
    @Field(() => Boolean, { description: "Whether the operation was successful", defaultValue: true })
    ok!: true;

    @Field(() => String, { description: "The UUID of the created resource" })
    uuid!: string;

    @Field(() => type, { nullable: true, description: "The payload of the response" })
    data?: T;
  }
  return GraphQLCreatedResponse;
}

@InterfaceType({ description: "API response", implements: AbstractGraphQLOkResponse })
export abstract class AbstractGraphQLPaginatedResponse<T> extends AbstractGraphQLOkResponse<T[]> {
  total!: number;
  pageSize!: number;
  page!: number;

  static newOk(): never {
    throw new Error("Cannot call newOk on a subclass of AbstractGraphQLPaginatedResponse, use newPaginated instead");
  }

  static newPaginated<T, PRes extends AbstractGraphQLPaginatedResponse<T>>(this: ClassType<PRes>, data: T[], total: number, pageSize?: number | null | undefined, page?: number | null | undefined): PRes {
    const response = new this();
    response.ok = true;
    response.data = data;
    response.total = total;
    response.pageSize = pageSize ?? DEFAULT_PAGE_SIZE;
    response.page = page ?? DEFAULT_PAGE;
    return response;
  }

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

/**
 *
 * @param name
 * @param type
 */
export function defineGraphQlPaginatedResponse<T extends object>(name: string, type: ClassType<T>) {
  @ObjectType(name, { description: "API response", implements: AbstractGraphQLPaginatedResponse })
  class GraphQLPaginatedResponse extends AbstractGraphQLPaginatedResponse<T> {
    @Field(() => Boolean, { description: "Whether the operation was successful", defaultValue: true })
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

registerEnumType(ErrorCode, { name: "ErrorCode", description: "Error codes" })

@ObjectType({ description: "API response", implements: GraphQLBaseResponse })
export class GraphQLErrorResponse extends GraphQLBaseResponse {
  @Field(() => Boolean, { description: "Whether the operation was successful", defaultValue: false })
  ok!: false;

  @Field(() => ErrorCode, { description: "The error code", defaultValue: ErrorCode.Unknown })
  errorCode!: ErrorCode;

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
      code: this.errorCode,
      errorMessage: this.message,
    };
    if (this.clientActions != null) baseResponse.clientActions = this.clientActions;
    if (this.details != null) baseResponse.errorDetails = this.details;
    if (this.explanation != null) baseResponse.errorExplanation = this.explanation;
    return baseResponse;
  }

  static from(val: Error | string | ApiError, code: ErrorCode = ErrorCode.Unknown): GraphQLErrorResponse {
    const response = new GraphQLErrorResponse();
    response.ok = false;
    response.errorCode = code;

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

/**
 *
 * @param type
 * @param typeName
 */
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
