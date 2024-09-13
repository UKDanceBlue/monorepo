import "reflect-metadata";

export * from "./api/filtering/FilterItem.js";
export {
  Comparator,
  IsComparator,
  NumericComparator,
  SortDirection,
  StringComparator,
} from "./api/filtering/ListQueryTypes.js";
export type {
  FilterOptions,
  ListQueryType,
  PaginationOptions,
  SortingOptions,
} from "./api/filtering/ListQueryTypes.js";

export * from "./authorization/accessControl.js";
export * from "./utility/errors/ApiError.js";

export * from "./utility/primitive/SimpleTypes.js";

export * from "./api/jwt.js";

export * from "./authorization/role.js";
export * from "./authorization/structures.js";

export * from "./utility/primitive/TypeUtils.js";
export * from "./utility/primitive/base64.js";
export * from "./utility/primitive/formData.js";
export * from "./utility/primitive/typeTransformers.js";
export * from "./utility/time/comparators.js";
export * from "./utility/time/intervalTools.js";

export * from "./api/resources/index.js";
export * from "./utility/errors/DetailedError.js";

export * from "./api/filtering/list-query-args/FilterItem.js";
export * from "./api/filtering/list-query-args/FilteredListQueryArgs.js";
export * from "./api/filtering/list-query-args/UnfilteredListQueryArgs.js";
export * from "./api/filtering/list-query-args/common.js";
export * from "./api/filtering/list-query-args/registerFilterKeyEnums.js";

/*
Note:
If the .js is missing in a bunch of places, use this regex to replace:

Replace:   import (.*)from "(((\.|(\.\.))/(\w|/)*?)+)"
With:      import $1from "$2.js"

*/
