import type { DateTime } from "luxon";

import type {
  BooleanComparator,
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
    : ValueType extends boolean
    ? BooleanComparator // Boolean uses BooleanComparators
    : Comparator.EQUALS; // Default to Comparator.EQUALS
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

export interface SortingOptions {
  /**
   * The field to sort by.
   */
  sortBy: string;
  /**
   * The direction to sort by.
   * Default depends on the field type, for example a numeric
   * field would be ascending by default, while a date field
   * would be descending by default.
   */
  sortDirection?: "asc" | "desc";
}

export interface FilterOptions<Resource extends object> {
  /**
   * The fields to include in the response.
   * If this is not specified, default fields will be included.
   */
  include?: (keyof Resource)[];
  /**
   * The fields to exclude from the response.
   * If this is not specified, no fields will be excluded.
   * This has precedence over `include`.
   */
  exclude?: (keyof Resource)[];
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

export function makeListQuery<Resource extends object>(
  options: Partial<ListQueryType<Resource>> = {}
) {
  const { page, pageSize, sortBy, sortDirection, filter } = options;

  const query = new URLSearchParams();

  if (page) {
    query.set("page", page.toString());
  }
  if (pageSize) {
    query.set("pageSize", pageSize.toString());
  }
  if (sortBy) {
    query.set("sortBy", sortBy);
  }
  if (sortDirection) {
    query.set("sortDirection", sortDirection);
  }

  if (filter) {
    // TODO: Implement filters
  }

  return query;
}
