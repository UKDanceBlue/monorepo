import { AbstractGraphQLOkResponse, Resource } from "@ukdanceblue/common";

export interface ResolverInterface<T extends Resource> {
  getByUuid(uuid: string): Promise<AbstractGraphQLOkResponse<T>>;
  delete(uuid: string): Promise<AbstractGraphQLOkResponse<boolean>>;
}