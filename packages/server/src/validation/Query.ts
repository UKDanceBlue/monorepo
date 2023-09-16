import type {
  FilterItem,
  FilterOptions,
  PaginationOptions,
  SortingOptions,
} from "@ukdanceblue/common";
import { Comparator } from "@ukdanceblue/common";
import type { Schema } from "joi";
import Joi from "joi";

export const paginationOptionsSchema: Joi.StrictSchemaMap<PaginationOptions> = {
  page: Joi.number().integer().min(1).optional().default(1),
  pageSize: Joi.number().integer().min(1).optional().default(10),
};

export const sortingOptionsSchema: Joi.StrictSchemaMap<SortingOptions> = {
  sortBy: Joi.string().optional().not("id"),
  sortDirection: Joi.string().valid("asc", "desc").optional().default("asc"),
};

type FilterOption<
  T extends object,
  K extends keyof T & string = keyof T & string
> = [K, Schema<T[K]>];

const comparisonSchema = Joi.string().valid(...Object.values(Comparator));

function filterOptionToFilterItemValidator<
  T extends object,
  K extends keyof T & string
>(option: FilterOption<T, K>): [K, Schema<FilterItem<T, K, T[K]>>] {
  const [key, schema] = option;
  return [
    key,
    Joi.object<FilterItem<T, K, T[K]>>({
      [key]: {
        // TODO: Right now there is no validation of legal comparators and repeating the comparator list could be replaced with a Joi reference
        value: schema.required(),
        comparison: comparisonSchema,
      },
    }),
  ];
}

/**
 * Creates a Joi schema for the filter options of a query. This is used for
 * the `include`, `exclude`, and `filter` query parameters.
 *
 * @param includeExcludeOptions A list of properties that can be included or excluded
 * in the query
 * @param filterOptions A list of properties that can be filtered on an the relevant
 * joi schema for each property
 * @return The Joi schema for the filter options
 */
export function makeFilterOptionsSchema<T extends object>(
  includeExcludeOptions: (keyof T)[],
  filterOptions: FilterOption<T>[]
): Joi.StrictSchemaMap<FilterOptions<T>> {
  return {
    include: Joi.array().items(Joi.string().valid(...includeExcludeOptions)),
    exclude: Joi.array().items(Joi.string().valid(...includeExcludeOptions)),
    // @ts-expect-error This is a valid schema, but Joi doesn't like it
    filter: Joi.object(
      Object.fromEntries(filterOptions.map(filterOptionToFilterItemValidator))
    ),
  };
}
