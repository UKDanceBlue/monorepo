import type { Primitive, PrimitiveObject } from "../../index.js";
import { isPrimitive, isPrimitiveObject } from "../../index.js";

export enum ClientAction {
  LOGOUT = "logout",
}

export interface BaseResponse {
  /**
   * Whether the request was successful (usually found on a 2xx response)
   */
  ok: boolean;
  /**
   * The client actions to perform, if this field is present
   * the client MUST perform the relevant actions if they are
   * supported.
   */
  clientActions?: ClientAction[];
}

export interface OkApiResponse<DataType> extends BaseResponse {
  ok: true;
  /**
   * The payload of the response (can be pretty much anything)
   */
  data?: DataType;
}

export function isSingularOkApiResponse(
  response: unknown
): response is OkApiResponse<Primitive | PrimitiveObject> {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    ("data" in response
      ? (
        (isPrimitive(response.data) || isPrimitiveObject(response.data)) &&
        !Array.isArray(response.data)
      )
      : true)
  );
}

export function isArrayOkApiResponse<DataType = unknown>(
  response: unknown
): response is OkApiResponse<DataType[]> {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "data" in response &&
    Array.isArray(response.data)
  );
}

export function isOkApiResponse<DataType = unknown>(
  response: unknown
): response is OkApiResponse<DataType> {
  return isSingularOkApiResponse(response) || isArrayOkApiResponse(response);
}

/**
 * Creates an OK API response with the given data.
 *
 * @param opts The options
 * @param opts.value The response data
 * @return The OK API response
 */
export function okResponseFrom<DataType>({
  value = undefined,
}: {
  value?: DataType;
} = {}): OkApiResponse<DataType> {
  const response: OkApiResponse<DataType> = {
    ok: true,
  };
  if (value !== undefined) {
    response.data = value;
  }
  return response;
}

export interface CreatedApiResponse<DataType> extends OkApiResponse<DataType> {
  /**
   * The UUID of the created resource (this is the UUID not the sequential UUID)
   */
  uuid: string;
}

export function isCreatedApiResponse<DataType = unknown>(
  response: unknown
): response is CreatedApiResponse<DataType> {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "uuid" in response &&
    typeof response.uuid === "string"
  );
}

/**
 * Creates a "created" API response indicating that a resource was successfully created.
 * The response will have an `uuid` property that refers to the UUID of the created resource.
 * It may also have a `data` property if the resource was returned in the response.
 *
 * @param opts The options
 * @param opts.value The response data
 * @param opts.uuid The UUID of the created resource
 * @return The created API response
 */
export function createdResponseFrom<DataType>({
  value,
  uuid,
}: {
  value?: DataType;
  uuid: string;
}): CreatedApiResponse<DataType> {
  const okResponse: OkApiResponse<DataType> =
    value !== undefined ? okResponseFrom({ value }) : okResponseFrom();
  return {
    ...okResponse,
    uuid,
  };
}

export interface PaginationInfo {
  /**
   * The current page number (1-indexed)
   */
  page: number;
  /**
   * The number of items per page
   */
  pageSize: number;
  /**
   * The total number of items
   */
  total: number;
}

export function isPaginationInfo(
  pagination: unknown
): pagination is PaginationInfo {
  return (
    typeof pagination === "object" &&
    pagination !== null &&
    "page" in pagination &&
    typeof pagination.page === "number" &&
    "pageSize" in pagination &&
    typeof pagination.pageSize === "number" &&
    "total" in pagination &&
    typeof pagination.total === "number"
  );
}

export interface PaginatedApiResponse<DataType>
  extends OkApiResponse<DataType[]> {
  /**
   * The pagination settings the server used to generate the response
   */
  pagination: PaginationInfo;
}

export function isPaginatedApiResponse<DataType = unknown>(
  response: unknown
): response is PaginatedApiResponse<DataType> {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "data" in response &&
    Array.isArray(response.data) &&
    "pagination" in response &&
    isPaginationInfo(response.pagination)
  );
}

export function paginatedResponseFrom<DataType>({
  value,
  pagination,
}: {
  value: DataType[];
  pagination: PaginationInfo;
}): PaginatedApiResponse<DataType> {
  const okResponse = okResponseFrom({ value });
  return {
    ...okResponse,
    pagination,
  };
}

export interface ApiError<HasCause extends boolean = boolean> {
  /**
   * The error message, this should be a short human-readable, but not
   * necessarily user-friendly, message.
   */
  errorMessage: string;
  /**
   * The error details, this should be a longer human-readable, but not
   * necessarily user-friendly, message.
   */
  errorDetails?: string;
  /**
   * The error explanation, this should be a user-friendly message.
   * If present, this should be shown to the user.
   */
  errorExplanation?: string;
  /**
   * The error cause, this should be the original error that caused the
   * error response. This should not be shown to the user and for some
   * errors can be used to address the issue.
   */
  errorCause?: HasCause extends true ? unknown : never;
}

export function isApiError(error: unknown): error is ApiError {
  if (
    typeof error !== "object" ||
    error === null ||
    !("errorMessage" in error) ||
    typeof error.errorMessage !== "string"
  ) {
    return false;
  } else if (
    "errorDetails" in error &&
    typeof error.errorDetails !== "string"
  ) {
    return false;
  } else if (
    "errorExplanation" in error &&
    typeof error.errorExplanation !== "string"
  ) {
    return false;
  } else {
    return true;
  }
}

export interface ErrorApiResponse extends BaseResponse, ApiError {
  ok: false;
}

export function isErrorApiResponse(
  response: unknown
): response is ErrorApiResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === false &&
    "errorMessage" in response &&
    typeof response.errorMessage === "string" &&
    ("errorDetails" in response
      ? typeof response.errorDetails === "string"
      : true) &&
    ("errorExplanation" in response
      ? typeof response.errorExplanation === "string"
      : true)
  );
}

/**
 * Creates an error API response with the given error message.
 *
 * @param root0 The options
 * @param root0.errorMessage The error message
 * @param root0.errorDetails The error details
 * @param root0.errorCause The error cause
 * @param root0.errorExplanation The error explanation
 * @return The error API response
 */
export function errorResponseFrom({
  errorMessage,
  errorDetails = undefined,
  errorExplanation = undefined,
  errorCause = undefined,
}: ApiError): ErrorApiResponse {
  const response: ErrorApiResponse = {
    errorMessage,
    ok: false,
  };

  if (errorDetails !== undefined) {
    response.errorDetails = errorDetails;
  }
  if (errorExplanation !== undefined) {
    response.errorExplanation = errorExplanation;
  }
  if (errorCause !== undefined) {
    response.errorCause = errorCause;
  }

  return response;
}

export type ApiResponse<DataType> =
  | OkApiResponse<DataType | DataType[]>
  | CreatedApiResponse<DataType>
  | PaginatedApiResponse<DataType>
  | ErrorApiResponse;

export function isApiResponse(response: unknown): response is ApiResponse<unknown> {
  return isOkApiResponse(response) || isErrorApiResponse(response);
}
