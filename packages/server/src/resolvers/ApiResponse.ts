import { ErrorCode, GlobalIdScalar } from "@ukdanceblue/common";
import type { GlobalId } from "@ukdanceblue/common";
import { NonNegativeIntResolver, PositiveIntResolver } from "graphql-scalars";
import { Field, InterfaceType, registerEnumType } from "type-graphql";

import type { ClassType } from "type-graphql";

const DEFAULT_PAGE_SIZE = 10;
const FIRST_PAGE = 1;

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
  @Field(() => GlobalIdScalar)
  uuid!: GlobalId;

  toJson() {
    return {
      ...super.toJson(),
      uuid: this.uuid,
    };
  }

  declare static newOk: never;

  static newCreated<
    T extends { id: GlobalId },
    OkRes extends AbstractGraphQLCreatedResponse<T>,
  >(this: ClassType<OkRes>, data: T): OkRes {
    const response = new this();
    response.ok = true;
    if (data != null) {
      response.data = data;
    }

    response.uuid = data.id;

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
