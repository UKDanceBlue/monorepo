import type { ApiError } from "../../response/JsonResponse.js";
import type { Resource } from "../object-types/Resource.js";

export interface ServiceInterface<R extends Resource> {
  getByUuid(uuid: string): Promise<R | null | ApiError>;
  create(input: Partial<R>): Promise<{ data?: R, uuid: string } | ApiError>;
  set(uuid: string, input: Partial<R>): Promise<R | ApiError>;
  delete(uuid: string): Promise<boolean | ApiError>;
}
