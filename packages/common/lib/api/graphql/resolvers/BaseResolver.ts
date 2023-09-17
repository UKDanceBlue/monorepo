import type { ClassType } from "type-graphql";
import { Arg, Mutation, Query, Resolver, createUnionType } from "type-graphql";
import type { Token } from "typedi";


import { isApiError } from "../../response/JsonResponse.js";
import type { AbstractGraphQLOkResponse } from "../object-types/ApiResponse.js";
import { GraphQLErrorResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "../object-types/ApiResponse.js";
import type { Resource } from "../object-types/Resource.js";
import type { ServiceInterface } from "../service-declarations/ServiceInterface.js";
import { graphQLServiceContainer } from "../service-declarations/index.js";

export function createBaseResolver<T extends Resource, S extends ServiceInterface<T>>(resourceName: string, objectTypeCls: ClassType<T>, token: Token<S>) {
  const getResourceByIdResponseName = `Get${resourceName}ByIdResponse`;
  const GetResourceByIdResponse = defineGraphQlOkResponse(getResourceByIdResponseName, objectTypeCls);
  const deleteResourceResponseName = `Delete${resourceName}Response`;
  const DeleteResourceResponse = defineGraphQlOkResponse(deleteResourceResponseName, Boolean);

  const GetByIdResponseUnion = withGraphQLErrorUnion(GetResourceByIdResponse, getResourceByIdResponseName);

  const DeleteResourceResponseUnion = withGraphQLErrorUnion(DeleteResourceResponse, deleteResourceResponseName);

  @Resolver()
  abstract class BaseResolver {
    // eslint-disable-next-line class-methods-use-this
    get service(): S {
      return graphQLServiceContainer.get(token);
    }

    @Query(() => GetByIdResponseUnion, { name: `get${resourceName}ById`, nullable: true })
    async getById(@Arg("id") id: string): Promise<typeof GetByIdResponseUnion> {
      const result = await this.service.getByUuid(id);
      if (isApiError(result)) {
        return GraphQLErrorResponse.from(result);
      }
      return GetResourceByIdResponse.newOk(result);
    }

    @Mutation(() => DeleteResourceResponseUnion, { name: `delete${resourceName}`, nullable: true })
    async delete(@Arg("id") id: string): Promise<typeof DeleteResourceResponseUnion> {
      const result = await this.service.delete(id);
      if (isApiError(result)) {
        return GraphQLErrorResponse.from(result);
      }
      return DeleteResourceResponse.newOk(result);
    }
  }

  return BaseResolver;
}
