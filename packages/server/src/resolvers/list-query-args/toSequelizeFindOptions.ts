import type {
  Attributes,
  FindAndCountOptions,
  Model,
  ModelStatic,
  OrderItemColumn,
  WhereAttributeHash,
} from "@sequelize/core";
import type {
  AbstractFilteredListQueryArgs,
  UnorderedOrderItemArray,
} from "@ukdanceblue/common";
import { FIRST_PAGE, SortDirection } from "@ukdanceblue/common";

import { filterToWhereOptions } from "./filterToWhereOptions.js";

export function toSequelizeFindOptions<
  M extends Model<Record<string, unknown>>,
>(
  queryArgs: AbstractFilteredListQueryArgs<
    string,
    string,
    string,
    string,
    string
  >,
  columnMap: Partial<Record<string, OrderItemColumn>>,
  orderOverrideMap: Partial<Record<string, UnorderedOrderItemArray>>,
  modelStatic?: ModelStatic<M>
): FindAndCountOptions<Attributes<M>> & {
  where: Partial<WhereAttributeHash<Attributes<M>>>;
} {
  if (!modelStatic) {
    throw new Error(`No model static provided to toSequelizeFindOptions`);
  }

  const options: FindAndCountOptions<Record<string, never>> = {
    paranoid: queryArgs.includeDeleted === true ? false : true,
  };

  if (queryArgs.sendAll !== true) {
    if (queryArgs.pageSize != null) {
      options.limit = queryArgs.pageSize;
    }

    if (queryArgs.page != null) {
      options.offset =
        (queryArgs.page - FIRST_PAGE) * (queryArgs.pageSize ?? 10);
    }
  }

  if (queryArgs.sortBy != null) {
    const sortBy = queryArgs.sortBy.map(
      (key) => orderOverrideMap[key] ?? columnMap[key]
    );
    const sortDirection =
      queryArgs.sortDirection?.map((v) =>
        v === SortDirection.DESCENDING ? "DESC" : "ASC"
      ) ?? queryArgs.sortBy.map(() => "ASC");

    options.order = sortBy
      .filter((key, index) => key != null && sortDirection[index] != null)
      .map((key, index) => {
        return Array.isArray(key)
          ? [...key, sortDirection[index]!]
          : ([key as OrderItemColumn, sortDirection[index]!] as const);
      });
  }

  const whereOptions: Partial<WhereAttributeHash<Attributes<M>>> =
    filterToWhereOptions<M, string, string, string, string, string>(
      queryArgs,
      columnMap
    );

  return {
    ...options,
    where: whereOptions,
  };
}
