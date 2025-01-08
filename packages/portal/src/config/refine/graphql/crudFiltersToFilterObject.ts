import type { CrudFilter, LogicalFilter } from "@refinedev/core";
import type {
  AbstractFilterGroup,
  AbstractFilterItem,
} from "@ukdanceblue/common";
import { FilterGroupOperator } from "@ukdanceblue/common";
import {
  ArrayOperators,
  NoTargetOperators,
  SingleTargetOperators,
  TwoTargetOperators,
} from "@ukdanceblue/common";
import { DateTime } from "luxon";

import type { FieldTypes } from "./data";

export type FilterItem = AbstractFilterItem<string>;
export type FilterGroup = AbstractFilterGroup<string>;

export function crudFilterToFilterObject(
  crudFilter: LogicalFilter,
  fieldTypes: FieldTypes | undefined
): FilterItem {
  let filterItem: FilterItem;
  const fieldTypeEntry = fieldTypes?.[crudFilter.field];
  const [field, fieldType] = fieldTypeEntry
    ? Array.isArray(fieldTypeEntry)
      ? fieldTypeEntry
      : [crudFilter.field, fieldTypeEntry]
    : [crudFilter.field, undefined];

  switch (crudFilter.operator) {
    case "eq":
    case "ne": {
      switch (typeof crudFilter.value) {
        case "string": {
          filterItem = {
            field,
            filter: {
              singleStringFilter: {
                comparison:
                  crudFilter.operator === "ne"
                    ? SingleTargetOperators.NOT_EQUALS
                    : SingleTargetOperators.EQUALS,
                value: crudFilter.value,
              },
            },
          };
          break;
        }
        case "number": {
          filterItem = {
            field,
            filter: {
              singleNumberFilter: {
                comparison:
                  crudFilter.operator === "ne"
                    ? SingleTargetOperators.NOT_EQUALS
                    : SingleTargetOperators.EQUALS,
                value: crudFilter.value,
              },
            },
          };
          break;
        }
        case "boolean": {
          filterItem = {
            field,
            filter: {
              singleBooleanFilter: {
                comparison:
                  crudFilter.operator === "ne"
                    ? SingleTargetOperators.NOT_EQUALS
                    : SingleTargetOperators.EQUALS,
                value: crudFilter.value,
              },
            },
          };
          break;
        }
        case "undefined":
        case "object": {
          if (crudFilter.value == null) {
            filterItem = {
              field,

              filter: {
                nullFilter: {
                  comparison:
                    crudFilter.operator === "ne"
                      ? NoTargetOperators.IS_NULL
                      : NoTargetOperators.IS_NOT_NULL,
                },
              },
            };
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
        crudFilter.operator === "lt"
          ? SingleTargetOperators.LESS_THAN
          : crudFilter.operator === "gt"
            ? SingleTargetOperators.GREATER_THAN
            : crudFilter.operator === "lte"
              ? SingleTargetOperators.LESS_THAN_OR_EQUAL_TO
              : SingleTargetOperators.GREATER_THAN_OR_EQUAL_TO;
      switch (typeof crudFilter.value) {
        case "number": {
          filterItem = {
            field,

            filter: {
              singleNumberFilter: {
                comparison: comparator,
                value: crudFilter.value,
              },
            },
          };
          break;
        }
        case "string": {
          if (!fieldType) {
            throw new Error(
              "Field types are required to filter a string by lt, gt, lte, or gte"
            );
          }
          switch (fieldType) {
            case "date": {
              filterItem = {
                field,

                filter: {
                  singleDateFilter: {
                    comparison: comparator,
                    value: DateTime.fromISO(crudFilter.value),
                  },
                },
              };
              break;
            }
            case "string": {
              filterItem = {
                field,

                filter: {
                  singleStringFilter: {
                    comparison: comparator,
                    value: crudFilter.value,
                  },
                },
              };
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
      filterItem = {
        field,

        filter: {
          arrayStringFilter: {
            comparison:
              crudFilter.operator === "in"
                ? ArrayOperators.IN
                : ArrayOperators.NOT_IN,
            value: Array.isArray(crudFilter.value)
              ? crudFilter.value.map(String)
              : [String(crudFilter.value)],
          },
        },
      };
      break;
    }
    case "ina":
    case "nina": {
      throw new Error("Unsupported filter operator (n)ina");
    }
    case "contains":
    case "ncontains": {
      filterItem = {
        field,

        filter: {
          singleStringFilter: {
            comparison:
              crudFilter.operator === "ncontains"
                ? SingleTargetOperators.INSENSITIVE_NOT_CONTAINS
                : SingleTargetOperators.INSENSITIVE_CONTAINS,
            value: crudFilter.value,
          },
        },
      };
      break;
    }
    case "containss":
    case "ncontainss": {
      filterItem = {
        field,
        filter: {
          singleStringFilter: {
            comparison:
              crudFilter.operator === "ncontainss"
                ? SingleTargetOperators.NOT_CONTAINS
                : SingleTargetOperators.CONTAINS,
            value: crudFilter.value,
          },
        },
      };
      break;
    }
    case "between":
    case "nbetween": {
      const [min, max] = crudFilter.value as [unknown, unknown];
      switch (typeof min) {
        case "number": {
          filterItem = {
            field,
            filter: {
              twoNumberFilter: {
                comparison:
                  crudFilter.operator === "nbetween"
                    ? TwoTargetOperators.NOT_BETWEEN
                    : TwoTargetOperators.BETWEEN,
                lower: min,
                upper: max as typeof min,
              },
            },
          };
          break;
        }
        case "string": {
          if (!fieldType) {
            throw new Error(
              "Field types are required to filter a string by between"
            );
          }
          switch (fieldType) {
            case "date": {
              filterItem = {
                field,
                filter: {
                  twoDateFilter: {
                    comparison:
                      crudFilter.operator === "nbetween"
                        ? TwoTargetOperators.NOT_BETWEEN
                        : TwoTargetOperators.BETWEEN,
                    lower: DateTime.fromISO(min),
                    upper: DateTime.fromISO(max as typeof min),
                  },
                },
              };
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
    case "null":
    case "nnull": {
      filterItem = {
        field,
        filter: {
          nullFilter: {
            comparison:
              crudFilter.operator === "nnull"
                ? NoTargetOperators.IS_NOT_NULL
                : NoTargetOperators.IS_NULL,
          },
        },
      };
      break;
    }
    case "startswith":
    case "nstartswith": {
      filterItem = {
        field,
        filter: {
          singleStringFilter: {
            comparison:
              crudFilter.operator === "nstartswith"
                ? SingleTargetOperators.INSENSITIVE_NOT_STARTS_WITH
                : SingleTargetOperators.INSENSITIVE_STARTS_WITH,
            value: crudFilter.value,
          },
        },
      };
      break;
    }
    case "startswiths":
    case "nstartswiths": {
      filterItem = {
        field,
        filter: {
          singleStringFilter: {
            comparison:
              crudFilter.operator === "nstartswiths"
                ? SingleTargetOperators.NOT_STARTS_WITH
                : SingleTargetOperators.STARTS_WITH,
            value: crudFilter.value,
          },
        },
      };
      break;
    }
    case "endswith":
    case "nendswith": {
      filterItem = {
        field,
        filter: {
          singleStringFilter: {
            comparison:
              crudFilter.operator === "nendswith"
                ? SingleTargetOperators.INSENSITIVE_NOT_ENDS_WITH
                : SingleTargetOperators.INSENSITIVE_ENDS_WITH,
            value: crudFilter.value,
          },
        },
      };
      break;
    }
    case "endswiths":
    case "nendswiths": {
      filterItem = {
        field,
        filter: {
          singleStringFilter: {
            comparison:
              crudFilter.operator === "nendswiths"
                ? SingleTargetOperators.NOT_ENDS_WITH
                : SingleTargetOperators.ENDS_WITH,
            value: crudFilter.value,
          },
        },
      };
      break;
    }
    default: {
      crudFilter.operator satisfies never;
      throw new Error("Unsupported filter operator");
    }
  }

  return filterItem;
}

export function crudFiltersToFilterObject(
  crudFilter: CrudFilter,
  fieldTypes: FieldTypes | undefined
): {
  filterGroup?: FilterGroup;
  search?: string;
} {
  const filters: FilterGroup["filters"] = [];
  const children: FilterGroup["children"] = [];
  let search: string | undefined;

  if (crudFilter.operator === "or" || crudFilter.operator === "and") {
    const mapped = crudFilter.value
      .map((f) => crudFiltersToFilterObject(f, fieldTypes))
      .reduce<{
        children: FilterGroup[];
        search?: string;
      }>(
        (acc, { filterGroup, search }) => {
          if (filterGroup) {
            acc.children.push(filterGroup);
          }
          if (search) {
            acc.search = search;
          }
          return acc;
        },
        { children: [], search: undefined }
      );
    if (mapped.search) {
      search = mapped.search;
    }
    children.push({
      operator:
        crudFilter.operator === "or"
          ? FilterGroupOperator.OR
          : FilterGroupOperator.AND,
      filters: [],
      children: mapped.children,
    });
  } else if ((crudFilter as LogicalFilter).field === "$search") {
    search = crudFilter.value;
  } else {
    filters.push(
      crudFilterToFilterObject(crudFilter as LogicalFilter, fieldTypes)
    );
  }

  return {
    search,
    filterGroup: {
      operator:
        crudFilter.operator === "or"
          ? FilterGroupOperator.OR
          : FilterGroupOperator.AND,
      children,
      filters,
    },
  };
}
