import type { CrudFilters } from "@refinedev/core";
import { Comparator } from "@ukdanceblue/common";

import type { FieldTypes, FilterObject } from "./data";

export function crudFiltersToFilterObject(
  crudFilters: CrudFilters,
  fieldTypes: FieldTypes | undefined
): FilterObject {
  const filterObject: FilterObject = {
    booleanFilters: [],
    dateFilters: [],
    isNullFilters: [],
    numericFilters: [],
    oneOfFilters: [],
    stringFilters: [],
  };

  console.log("crudFilters", crudFilters);

  for (const filter of crudFilters) {
    switch (filter.operator) {
      case "eq":
      case "ne": {
        switch (typeof filter.value) {
          case "string": {
            filterObject.stringFilters.push({
              comparison: Comparator.EQUALS,
              field: filter.field,
              value: filter.value,
              negate: filter.operator === "ne",
            });
            break;
          }
          case "number": {
            filterObject.numericFilters.push({
              comparison: Comparator.EQUALS,
              field: filter.field,
              value: filter.value,
              negate: filter.operator === "ne",
            });
            break;
          }
          case "boolean": {
            filterObject.booleanFilters.push({
              comparison: Comparator.IS,
              field: filter.field,
              value: filter.value,
              negate: filter.operator === "ne",
            });
            break;
          }
          case "undefined":
          case "object": {
            if (filter.value == null) {
              filterObject.isNullFilters.push({
                field: filter.field,
                negate: filter.operator === "ne",
              });
              break;
            }
            throw new Error("Unsupported filter value type");
          }
          default: {
            throw new Error("Unsupported filter value type");
          }
        }
        break;
      }
      case "lt":
      case "gt":
      case "lte":
      case "gte": {
        const comparator =
          filter.operator === "lt"
            ? Comparator.LESS_THAN
            : filter.operator === "gt"
              ? Comparator.GREATER_THAN
              : filter.operator === "lte"
                ? Comparator.LESS_THAN_OR_EQUAL_TO
                : Comparator.GREATER_THAN_OR_EQUAL_TO;
        switch (typeof filter.value) {
          case "number": {
            filterObject.numericFilters.push({
              comparison: comparator,
              field: filter.field,
              value: filter.value,
            });
            break;
          }
          case "string": {
            if (!fieldTypes) {
              throw new Error(
                "Field types are required to filter a string by lt, gt, lte, or gte"
              );
            }
            switch (fieldTypes[filter.field]) {
              case "date": {
                filterObject.dateFilters.push({
                  comparison: comparator,
                  field: filter.field,
                  value: filter.value,
                });
                break;
              }
              case "string": {
                filterObject.stringFilters.push({
                  comparison: comparator,
                  field: filter.field,
                  value: filter.value,
                });
                break;
              }
              default: {
                throw new Error("Unsupported field type");
              }
            }
            break;
          }
          default: {
            throw new Error("Unsupported filter value type");
          }
        }
        break;
      }
      case "in":
      case "nin": {
        filterObject.oneOfFilters.push({
          field: filter.field,
          value: filter.value,
          negate: filter.operator === "nin",
        });
        break;
      }
      case "ina":
      case "nina": {
        throw new Error("Unsupported filter operator (n)ina");
      }
      case "contains":
      case "ncontains": {
        filterObject.stringFilters.push({
          comparison: Comparator.SUBSTRING,
          field: filter.field,
          value: filter.value,
          negate: filter.operator === "ncontains",
        });
        break;
      }
      case "containss":
      case "ncontainss": {
        throw new Error("Unsupported filter operator (n)containss");
      }
      case "between": {
        const [min, max] = filter.value as [unknown, unknown];
        switch (typeof min) {
          case "number": {
            filterObject.numericFilters.push(
              {
                comparison: Comparator.GREATER_THAN_OR_EQUAL_TO,
                field: filter.field,
                value: min,
              },
              {
                comparison: Comparator.LESS_THAN_OR_EQUAL_TO,
                field: filter.field,
                value: max as typeof min,
              }
            );
            break;
          }
          case "string": {
            if (!fieldTypes) {
              throw new Error(
                "Field types are required to filter a string by between"
              );
            }
            switch (fieldTypes[filter.field]) {
              case "date": {
                filterObject.dateFilters.push(
                  {
                    comparison: Comparator.GREATER_THAN_OR_EQUAL_TO,
                    field: filter.field,
                    value: min,
                  },
                  {
                    comparison: Comparator.LESS_THAN_OR_EQUAL_TO,
                    field: filter.field,
                    value: max as typeof min,
                  }
                );
                break;
              }
              case "string": {
                filterObject.stringFilters.push(
                  {
                    comparison: Comparator.GREATER_THAN_OR_EQUAL_TO,
                    field: filter.field,
                    value: min,
                  },
                  {
                    comparison: Comparator.LESS_THAN_OR_EQUAL_TO,
                    field: filter.field,
                    value: max as typeof min,
                  }
                );
                break;
              }
              default: {
                throw new Error("Unsupported field type");
              }
            }
            break;
          }
          default: {
            throw new Error("Unsupported filter value type");
          }
        }
        break;
      }
      case "nbetween": {
        throw new Error("Unsupported filter operator nbetween");
      }
      case "null":
      case "nnull": {
        filterObject.isNullFilters.push({
          field: filter.field,
          negate: filter.operator === "nnull",
        });
        break;
      }
      case "startswith":
      case "nstartswith": {
        filterObject.stringFilters.push({
          comparison: Comparator.STARTS_WITH,
          field: filter.field,
          value: filter.value,
          negate: filter.operator === "nstartswith",
        });
        break;
      }
      case "startswiths":
      case "nstartswiths": {
        throw new Error("Unsupported filter operator (n)startswiths");
      }
      case "endswith":
      case "nendswith": {
        filterObject.stringFilters.push({
          comparison: Comparator.ENDS_WITH,
          field: filter.field,
          value: filter.value,
          negate: filter.operator === "nendswith",
        });
        break;
      }
      case "endswiths":
      case "nendswiths": {
        throw new Error("Unsupported filter operator (n)endswiths");
      }
      case "or": {
        throw new Error("Unsupported filter operator or");
      }
      case "and": {
        for (const subFilter of filter.value) {
          const subFilterObject = crudFiltersToFilterObject(
            [subFilter],
            fieldTypes
          );
          filterObject.booleanFilters.push(...subFilterObject.booleanFilters);
          filterObject.dateFilters.push(...subFilterObject.dateFilters);
          filterObject.isNullFilters.push(...subFilterObject.isNullFilters);
          filterObject.numericFilters.push(...subFilterObject.numericFilters);
          filterObject.oneOfFilters.push(...subFilterObject.oneOfFilters);
          filterObject.stringFilters.push(...subFilterObject.stringFilters);
        }
      }
    }
  }

  return filterObject;
}
