import type { DateTime } from "luxon";

import type {
  EqualityComparator,
  Comparator,
  NumericComparator,
  StringComparator,
} from "../../util/TypeUtils.js";

/**
 * Date fields should be sent as ISO 8601 strings.
 */
export interface FilterItem<
  Resource extends object,
  Key extends keyof Resource & string = keyof Resource & string,
  ValueType extends Resource[Key] = Resource[Key]
> {
  /**
   * The value to filter on.
   * If this is an array, the field will be filtered on any of the values.
   */
  value: ValueType extends DateTime
  ? string // DateTime uses ISO 8601 strings
  : ValueType;
  /**
   * The operator to use for the filter.
   */
  comparison: ValueType extends DateTime
  ? NumericComparator // DateTime uses NumericComparators
  : ValueType extends string
  ? StringComparator // String uses StringComparators
  : ValueType extends number
  ? NumericComparator // Number uses NumericComparators
  : EqualityComparator; // Default to Comparator.EQUALS
}

// type StringFilter<
//   FilterType extends FilterItem<Record<string, Primitive>, string>
// > =
//   `filter[${FilterType["field"]}][]=${FilterType["comparison"]}:${FilterType["value"]}`;

export interface PaginationOptions {
  /**
   * The page number to return.
   */
  page: number;
  /**
   * The number of items to return per page.
   */
  pageSize: number;
}

export const SortDirection = {
  ASCENDING: "asc",
  DESCENDING: "desc",
} as const;

export type SortDirection = typeof SortDirection[keyof typeof SortDirection];

export interface SortingOptions {
  /**
   * The field to sort by.
   */
  sortBy: string[];
  /**
   * The direction to sort by.
   * Default depends on the field type, for example a numeric
   * field would be ascending by default, while a date field
   * would be descending by default.
   */
  sortDirection?: SortDirection[];
}

export interface FilterOptions<Resource extends object> {
  /**
   * A list of filters to apply to the request, this will search
   * the database for only the resources that match the filters.
   */
  filter?: Partial<
    Record<
      keyof Resource & string,
      FilterItem<Resource, keyof Resource & string>[]
    >
  >;
}

export type ListQueryType<Resource extends object> = FilterOptions<Resource> &
  PaginationOptions &
  SortingOptions;
