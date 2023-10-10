export const Comparator = {
  EQUALS: "EQUALS",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  GREATER_THAN_OR_EQUAL_TO: "GREATER_THAN_OR_EQUAL_TO",
  LESS_THAN_OR_EQUAL_TO: "LESS_THAN_OR_EQUAL_TO",
  LIKE: "LIKE",
  REGEX: "REGEX",
  SUBSTRING: "SUBSTRING",
  STARTS_WITH: "STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  IS: "IS",
} as const;
export type Comparator = (typeof Comparator)[keyof typeof Comparator];

export const StringComparator = {
  EQUALS: "EQUALS",
  LIKE: "LIKE",
  REGEX: "REGEX",
  SUBSTRING: "SUBSTRING",
  STARTS_WITH: "STARTS_WITH",
  ENDS_WITH: "ENDS_WITH",
  IS: "IS",
} as const;
export type StringComparator =
  (typeof StringComparator)[keyof typeof StringComparator];

export const NumericComparator = {
  EQUALS: "EQUALS",
  GREATER_THAN: "GREATER_THAN",
  LESS_THAN: "LESS_THAN",
  GREATER_THAN_OR_EQUAL_TO: "GREATER_THAN_OR_EQUAL_TO",
  LESS_THAN_OR_EQUAL_TO: "LESS_THAN_OR_EQUAL_TO",
  IS: "IS",
} as const;
export type NumericComparator =
  (typeof NumericComparator)[keyof typeof NumericComparator];

export const IsComparator = {
  IS: "IS",
} as const;
export type IsComparator = (typeof IsComparator)[keyof typeof IsComparator];

export interface FilterItem<Field extends string, ValueType> {
  field: Field;

  value: ValueType;

  comparison: Comparator;
  /**
   * Should the comparator be negated?
   * WARNING: This will throw if used on a comparator that does not support negation.
   * @default false
   */
  negate?: boolean;
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
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING",
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

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
  sortDirection: SortDirection[];
}

export interface FilterOptions<Resource extends object> {
  /**
   * A list of filters to apply to the request, this will search
   * the database for only the resources that match the filters.
   */
  filter?: Partial<
    Record<
      keyof Resource & string,
      FilterItem<keyof Resource & string, Resource[keyof Resource]>
    >
  >;
}

export type ListQueryType<Resource extends object> = FilterOptions<Resource> &
  PaginationOptions &
  SortingOptions;
