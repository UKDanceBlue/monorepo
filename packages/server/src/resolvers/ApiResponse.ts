import type {
  ApiError,
  BaseResponse,
  CreatedApiResponse,
  ErrorApiResponse,
  OkApiResponse,
  PaginatedApiResponse,
} from "@ukdanceblue/common";
import { ClientAction, ErrorCode } from "@ukdanceblue/common";
import { NonNegativeIntMock, NonNegativeIntResolver } from "graphql-scalars";
import type { ClassType } from "type-graphql";
import { Field, InterfaceType, registerEnumType } from "type-graphql";

import { DEFAULT_PAGE_SIZE, FIRST_PAGE } from "./list-query-args/common.js";

registerEnumType(ClientAction, {
  name: "ClientAction",
  description: "Actions that the client MUST take if specified",
});

@InterfaceType({ description: "API response" })
export class GraphQLBaseResponse implements BaseResponse {
  @Field(() => Boolean, { description: "Whether the operation was successful" })
  ok!: boolean;

  @Field(() => [ClientAction], {
    nullable: true,
    description: "Client actions to perform",
  })
  clientActions?: ClientAction[];

  toJson(): BaseResponse {
    const baseResponse: BaseResponse = {
      ok: this.ok,
    };
    if (this.clientActions != null) {
      baseResponse.clientActions = this.clientActions;
    }
    return baseResponse;
  }
}

@InterfaceType({ description: "API response", implements: GraphQLBaseResponse })
export abstract class AbstractGraphQLOkResponse<T>
  extends GraphQLBaseResponse
  implements OkApiResponse<T>
{
  @Field(() => Boolean, {
    description: "Whether the operation was successful",
    defaultValue: true,
  })
  ok!: true;

  data?: T;

  toJson(): OkApiResponse<T> {
    const baseResponse: OkApiResponse<T> = {
      ok: this.ok,
    };
    if (this.clientActions != null) {
      baseResponse.clientActions = this.clientActions;
    }
    if (this.data != null) {
      baseResponse.data = this.data;
    }
    return baseResponse;
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
export abstract class AbstractGraphQLArrayOkResponse<T>
  extends AbstractGraphQLOkResponse<T[]>
  implements OkApiResponse<T[]>
{
  toJson(): OkApiResponse<T[]> {
    const baseResponse: OkApiResponse<T[]> = {
      ok: this.ok,
    };
    if (this.clientActions != null) {
      baseResponse.clientActions = this.clientActions;
    }
    if (this.data != null) {
      baseResponse.data = this.data;
    }
    return baseResponse;
  }
}

@InterfaceType({
  description: "API response",
  implements: AbstractGraphQLOkResponse,
})
export abstract class AbstractGraphQLCreatedResponse<T>
  extends AbstractGraphQLOkResponse<T>
  implements CreatedApiResponse<T>
{
  @Field(() => String)
  uuid!: string;

  toJson(): CreatedApiResponse<T> {
    const baseResponse: CreatedApiResponse<T> = {
      ok: this.ok,
      uuid: this.uuid,
    };
    if (this.clientActions != null) {
      baseResponse.clientActions = this.clientActions;
    }
    if (this.data != null) {
      baseResponse.data = this.data;
    }
    return baseResponse;
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

  @Field(() => NonNegativeIntMock, {
    description: "The number of items per page",
  })
  pageSize!: number;

  @Field(() => NonNegativeIntMock, {
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

  toJson(): PaginatedApiResponse<T> {
    const baseResponse: PaginatedApiResponse<T> = {
      ok: this.ok,
      pagination: {
        total: this.total,
        pageSize: this.pageSize,
        page: this.page,
      },
    };
    if (this.clientActions != null) {
      baseResponse.clientActions = this.clientActions;
    }
    if (this.data != null) {
      baseResponse.data = this.data;
    }
    return baseResponse;
  }
}

registerEnumType(ErrorCode, { name: "ErrorCode", description: "Error codes" });

export class DetailedError extends Error implements ErrorApiResponse {
  ok = false as const;
  code: ErrorCode;
  details?: string;
  explanation?: string;

  clientActions?: ClientAction[];

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
