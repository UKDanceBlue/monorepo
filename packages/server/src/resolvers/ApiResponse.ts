import type { ApiError } from "@ukdanceblue/common";
import { ErrorCode } from "@ukdanceblue/common";
import { NonNegativeIntResolver, PositiveIntResolver } from "graphql-scalars";
import type { ClassType } from "type-graphql";
import { Field, InterfaceType, registerEnumType } from "type-graphql";

import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "./list-query-args/common.js";

@InterfaceType({ description: "API response" })
export class GraphQLBaseResponse {
  @Field(() => Boolean)
  ok!: boolean;

  toJson() {
    return {};
  }
}

@InterfaceType({ description: "API response", implements: GraphQLBaseResponse })
export abstract class AbstractGraphQLOkResponse<T> extends GraphQLBaseResponse {
  data?: T;

  toJson() {
    return {
      ...super.toJson(),
      ok: true,
      data: this.data,
    };
  }

  static newOk<T, OkRes extends AbstractGraphQLOkResponse<T>>(
    this: ClassType<OkRes>,
    data?: T
  ): OkRes {
    const response = new this();
    response.ok = true;
    if (data != null) {
      response.data = data;
    }
    return response;
  }
}

@InterfaceType({ description: "API response", implements: GraphQLBaseResponse })
export abstract class AbstractGraphQLArrayOkResponse<
  T,
> extends AbstractGraphQLOkResponse<T[]> {
  toJson() {
    return {
      ...super.toJson(),
    };
  }
}

@InterfaceType({
  description: "API response",
  implements: AbstractGraphQLOkResponse,
})
export abstract class AbstractGraphQLCreatedResponse<
  T,
> extends AbstractGraphQLOkResponse<T> {
  @Field(() => String)
  uuid!: string;

  toJson() {
    return {
      ...super.toJson(),
      uuid: this.uuid,
    };
  }

  static newCreated<T, OkRes extends AbstractGraphQLCreatedResponse<T>>(
    this: ClassType<OkRes>,
    data: T,
    uuid: string
  ): OkRes {
    const response = new this();
    response.ok = true;
    if (data != null) {
      response.data = data;
    }
    response.uuid = uuid;
    return response;
  }
}

@InterfaceType({
  description: "API response",
  implements: AbstractGraphQLArrayOkResponse,
})
export abstract class AbstractGraphQLPaginatedResponse<
  T,
> extends AbstractGraphQLArrayOkResponse<T> {
  @Field(() => NonNegativeIntResolver, {
    description: "The total number of items",
  })
  total!: number;

  @Field(() => NonNegativeIntResolver, {
    description: "The number of items per page",
  })
  pageSize!: number;

  @Field(() => PositiveIntResolver, {
    description: "The current page number (1-indexed)",
  })
  page!: number;

  static newOk(): never {
    throw new Error(
      "Cannot call newOk on a subclass of AbstractGraphQLPaginatedResponse, use newPaginated instead"
    );
  }

  static newPaginated<T, PRes extends AbstractGraphQLPaginatedResponse<T>>(
    this: ClassType<PRes>,
    {
      data,
      total,
      page,
      pageSize,
    }: {
      data: T[];
      total: number;
      page?: number | null | undefined;
      pageSize?: number | null | undefined;
    }
  ): PRes {
    const response = new this();
    response.ok = true;
    response.data = data;
    response.total = total;
    response.page = page ?? FIRST_PAGE;
    response.pageSize = pageSize ?? DEFAULT_PAGE_SIZE;
    return response;
  }

  toJson() {
    const baseResponse = {
      ...super.toJson(),
      pagination: {
        total: this.total,
        pageSize: this.pageSize,
        page: this.page,
      },
    };
    return baseResponse;
  }
}

registerEnumType(ErrorCode, { name: "ErrorCode", description: "Error codes" });

export class DetailedError extends Error {
  code: ErrorCode;
  details?: string;
  explanation?: string;

  constructor(code: ErrorCode = ErrorCode.Unknown, message?: string) {
    super(message ?? code);
    this.code = code;
  }

  static from(
    val: Error | string | ApiError,
    code: ErrorCode = ErrorCode.Unknown
  ): DetailedError {
    const response = new DetailedError(code);

    if (typeof val === "string") {
      response.message = val;
    } else if (val instanceof Error) {
      response.message = val.message;
      if (val.stack) {
        response.stack = val.stack;
      }
      if (val.cause) {
        response.cause = val.cause;
      }
    } else {
      response.message = val.message;
      response.code = code;
      if (val.details) {
        response.details = val.details;
      }
      if (val.explanation) {
        response.explanation = val.explanation;
      }
      if (val.cause) {
        response.cause = val.cause;
      }
    }

    return response;
  }
}
