import type { ApiError, BaseResponse, CreatedApiResponse, ErrorApiResponse, OkApiResponse, PaginatedApiResponse } from "@ukdanceblue/common";
import { ClientAction, ErrorCode, VoidScalar } from "@ukdanceblue/common";
import type { ClassType } from "type-graphql";
import { ArgsType, Field, InterfaceType, ObjectType, createUnionType, registerEnumType } from "type-graphql";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "./ListQueryArgs.js";
import { GraphQLError } from "graphql";

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

export class DetailedError extends Error implements ErrorApiResponse {
  ok: false = false;
  code: ErrorCode;
  details?: string;
  explanation?: string;

  clientActions?: ClientAction[];

  constructor(code: ErrorCode = ErrorCode.Unknown, message?: string) {
    super(message ?? code);
    this.code = code;
  }

  static from(val: Error | string | ApiError, code: ErrorCode = ErrorCode.Unknown): DetailedError {
    const response = new DetailedError(code);

    if (typeof val === "string") {
      response.message = val;
    } else if (val instanceof Error) {
      response.message = val.message;
      if (val.stack) response.stack = val.stack;
      if (val.cause) response.cause = val.cause;
    } else {
      response.message = val.message;
      response.code = code ?? val.code;
      if (val.details) response.details = val.details;
      if (val.explanation) response.explanation = val.explanation;
      if (val.cause) response.cause = val.cause;
    }

    return response;
  }
}


/** @deprecated */
export function withGraphQLErrorUnion<T extends abstract new (...args: any) => any>(arg1: InstanceType<T>, arg2: string): InstanceType<T> {
  return arg1;
}

/** @deprecated */
export const GraphQLErrorResponse = {
  /** @deprecated */
  from(val: Error | string | ApiError, code: ErrorCode = ErrorCode.Unknown): DetailedError {
    throw DetailedError.from(val, code);
  }
}
