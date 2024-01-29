import type {
  AllowNotOrAndRecursive,
  FindAndCountOptions,
  InferAttributes,
  Model,
  OrderItemColumn,
} from "@sequelize/core";
import { Op } from "@sequelize/core";
import type {
  AbstractFilteredListQueryArgs,
  Comparator,
} from "@ukdanceblue/common";
import { TypeMismatchError } from "@ukdanceblue/common";
import { DateTime } from "luxon";

import { getSequelizeOpForComparator } from "./getSequelizeOpForComparator.js";

type AndWhereType<DbModel extends Model> = {
  [Op.and]: AllowNotOrAndRecursive<
    Exclude<
      FindAndCountOptions<
        InferAttributes<
          DbModel,
          {
            omit: never;
          }
        >
      >["where"],
      undefined
    >
  >[];
};

export function filterToWhereOptions<
  DbModel extends Model,
  AllKeys extends string,
  StringFilterKeys extends AllKeys,
  NumericFilterKeys extends AllKeys,
  DateFilterKeys extends AllKeys,
  BooleanFilterKeys extends AllKeys,
>(
  listQueryArgs: AbstractFilteredListQueryArgs<
    AllKeys,
    StringFilterKeys,
    NumericFilterKeys,
    DateFilterKeys,
    BooleanFilterKeys
  >,
  sortByMap: Partial<Record<AllKeys, OrderItemColumn>>
) {
  const whereOptions: AndWhereType<DbModel> = {
    [Op.and]: [],
  };

  function addWhereOption(
    field: AllKeys,
    comparison: Comparator,
    negate: boolean | undefined,
    value: string | number | Date | boolean | string[] | number[] | Date[]
  ) {
    const mappedField = sortByMap[field];
    if (!mappedField || typeof mappedField !== "string") {
      throw new Error(
        `No string mapping found for string filter field ${field}`
      );
    }
    whereOptions[Op.and].push({
      [mappedField]: {
        [getSequelizeOpForComparator(comparison, negate)]: value,
      },
    });
  }

  for (const filter of listQueryArgs.stringFilters ?? []) {
    const { field, negate, value, comparison } = filter;
    addWhereOption(field, comparison, negate, value);
  }
  for (const filter of listQueryArgs.numericFilters ?? []) {
    const { field, value, comparison, negate } = filter;
    addWhereOption(field, comparison, negate, value);
  }
  for (const filter of listQueryArgs.dateFilters ?? []) {
    const { field, value, comparison, negate } = filter;
    const jsDate = DateTime.isDateTime(value)
      ? value.toJSDate()
      : new Date(value.toString());

    if (jsDate.toString() === "Invalid Date") {
      throw new TypeMismatchError(
        "DateTime",
        `'JSON.stringify(value)'`,
        "Invalid Date"
      );
    }

    addWhereOption(field, comparison, negate, jsDate);
  }
  for (const filter of listQueryArgs.booleanFilters ?? []) {
    const { field, value, comparison, negate } = filter;
    addWhereOption(field, comparison, negate, value);
  }
  for (const filter of listQueryArgs.isNullFilters ?? []) {
    const { field, negate } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField || typeof mappedField !== "string") {
      throw new Error(
        `No string mapping found for is-null filter field ${field}`
      );
    }
    whereOptions[Op.and].push({
      [mappedField]: {
        [negate ? Op.not : Op.is]: null,
      },
    });
  }
  for (const filter of listQueryArgs.oneOfFilters ?? []) {
    const { field, value, negate } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField || typeof mappedField !== "string") {
      throw new Error(
        `No string mapping found for one-of filter field ${field}`
      );
    }
    whereOptions[Op.and].push({
      [mappedField]: {
        [negate ? Op.notIn : Op.in]: value,
      },
    });
  }
  return whereOptions;
}
