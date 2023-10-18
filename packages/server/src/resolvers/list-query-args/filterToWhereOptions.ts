import type { WhereAttributeHash } from "@sequelize/core";
import { Op } from "@sequelize/core";
import type { DateTimeScalar} from "@ukdanceblue/common";
import { TypeMismatchError } from "@ukdanceblue/common";
import { DateTime } from "luxon";

import type { AbstractFilteredListQueryArgs } from "./FilteredListQueryArgs.js";
import { getSequelizeOpForComparator } from "./getSequelizeOpForComparator.js";

export function filterToWhereOptions<
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
  sortByMap: Partial<Record<AllKeys, string>>,
  resolverName: string
) {
  const whereOptions: Partial<
    WhereAttributeHash<
      Record<string, string | number | typeof DateTimeScalar | boolean>
    >
  > = {};

  for (const filter of listQueryArgs.stringFilters ?? []) {
    const { field, negate, value, comparison } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField) {
      throw new Error(
        `No mapping found for string filter field ${field} on ${resolverName}`
      );
    }
    whereOptions[mappedField] = {
      [getSequelizeOpForComparator(comparison, negate)]: value,
    };
  }
  for (const filter of listQueryArgs.numericFilters ?? []) {
    const { field, value, comparison, negate } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField) {
      throw new Error(
        `No mapping found for numeric filter field ${field} on ${resolverName}`
      );
    }
    whereOptions[mappedField] = {
      [getSequelizeOpForComparator(comparison, negate)]: value,
    };
  }
  for (const filter of listQueryArgs.dateFilters ?? []) {
    const { field, value, comparison, negate } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField) {
      throw new Error(
        `No mapping found for numeric filter field ${field} on ${resolverName}`
      );
    }
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

    whereOptions[mappedField] = {
      [getSequelizeOpForComparator(comparison, negate)]: jsDate,
    };
  }
  for (const filter of listQueryArgs.booleanFilters ?? []) {
    const { field, value, comparison, negate } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField) {
      throw new Error(
        `No mapping found for numeric filter field ${field} on ${resolverName}`
      );
    }
    whereOptions[mappedField] = {
      [getSequelizeOpForComparator(comparison, negate)]: value,
    };
  }
  for (const filter of listQueryArgs.isNullFilters ?? []) {
    const { field, negate } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField) {
      throw new Error(
        `No mapping found for numeric filter field ${field} on ${resolverName}`
      );
    }
    whereOptions[mappedField] = {
      [negate ? Op.not : Op.is]: null,
    };
  }
  for (const filter of listQueryArgs.oneOfFilters ?? []) {
    const { field, value, negate } = filter;
    const mappedField = sortByMap[field];
    if (!mappedField) {
      throw new Error(
        `No mapping found for numeric filter field ${field} on ${resolverName}`
      );
    }
    whereOptions[mappedField] = {
      [negate ? Op.notIn : Op.in]: value,
    };
  }
  return whereOptions;
}
