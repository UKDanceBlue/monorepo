import type { Attributes, FindOptions, Model } from "@sequelize/core";
import type {
  FilterOptions,
  GraphQLResource,
  PaginationOptions,
  SortingOptions,
} from "@ukdanceblue/common";

import type { IntermediateClass } from "../modelTypes.js";

import type { ResourceToModelKeyMapping } from "./common.js";

type QueryFor<T extends GraphQLResource.Resource> = SortingOptions &
  PaginationOptions &
  FilterOptions<T>;
type FilterFor<T extends object> = NonNullable<FilterOptions<T>["filter"]>;

/**
 * Maps the filter keys from the API resource to the Sequelize model.
 *
 * @param filter The filter object
 * @param keyMapping A mapping of the API resource keys to the Sequelize model keys
 * @return The mapped filter object
 */
function mapFilterKeys<
  R extends GraphQLResource.Resource,
  M extends Model,
  I extends IntermediateClass<R, I>
>(
  filter: FilterFor<R>,
  keyMapping: ResourceToModelKeyMapping<R, M, I>
): FilterFor<Attributes<M>> {
  const mappedFilter: FilterFor<Attributes<M>> = {};
  for (const key of Object.keys(filter) as (keyof typeof filter)[]) {
    const mappedKey = keyMapping[key];
    if (mappedKey) {
      mappedFilter[mappedKey] = filter[key];
    }
  }
  return mappedFilter;
}

/**
 * Creates a Sequelize FindOptions object based on the query parameters.
 *
 * @param query The parsed query parameters
 * @param keyMapping A mapping of the API resource keys to the Sequelize model keys.
 * If a key is not mapped, it will be ignored.
 * @return The Sequelize FindOptions object
 */
export function makeListOptions<
  R extends GraphQLResource.Resource,
  M extends Model,
  I extends IntermediateClass<R, I>
>(
  query: QueryFor<R>,
  keyMapping: ResourceToModelKeyMapping<R, M, I>
): FindOptions<Attributes<M>> {
  const options: FindOptions<Attributes<M>> = {
    offset: (query.page - 1) * query.pageSize,
    limit: query.pageSize,
  };

  if (query.sortBy && query.sortDirection) {
    options.order = [[query.sortBy, query.sortDirection]];
  }

  const includes: (keyof Attributes<M> & string)[] = [];
  for (const include of query.include ?? []) {
    const mappedInclude = keyMapping[include];
    if (mappedInclude) {
      includes.push(mappedInclude);
    }
  }

  const excludes: (keyof Attributes<M> & string)[] = [];
  for (const exclude of query.exclude ?? []) {
    const mappedExclude = keyMapping[exclude];
    if (mappedExclude) {
      excludes.push(mappedExclude);
    }
  }

  const filter: FilterOptions<Attributes<M>>["filter"] = query.filter
    ? mapFilterKeys<R, M, I>(query.filter, keyMapping)
    : undefined;

  const totalIncludesExclude: number = includes.length + excludes.length;

  if (totalIncludesExclude > 0) {
    options.attributes = {
      include: includes,
      exclude: excludes,
    };
  }

  if (filter) {
    // TODO figure out where
    // const filterOptions: Partial<Record<keyof typeof filter, string>> = {}
    // for (const key of Object.keys(filter)) {
    //   filterOptions[key as keyof typeof filter] = filter[key as keyof typeof filter];
    // }
    // options.where = filterOptions;
  }
  return options;
}
