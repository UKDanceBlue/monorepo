import type { CrudFilter, LogicalFilter } from "@refinedev/core";
import type {
  AbstractFilterGroup,
  AbstractFilterItem,
  SomeFilter,
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

export type FilterItem = Omit<AbstractFilterItem<string>, "filter"> & {
  filter: Omit<SomeFilter, "filter">;
};
export type FilterGroup = Omit<
  AbstractFilterGroup<string>,
  "filters" | "children"
> & {
  filters: FilterItem[];
  children: FilterGroup[];
};

export function crudFilterToFilterObject(
  crudFilter: LogicalFilter,
  fieldTypes: FieldTypes | undefined
): FilterItem {
  switch (crudFilter.operator) {
    case "eq":
    case "ne": {
      switch (typeof crudFilter.value) {
        case "string": {
          return {
            field: crudFilter.field,
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
        }
        case "number": {
          return {
            field: crudFilter.field,
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
        }
        case "boolean": {
          return {
            field: crudFilter.field,
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
        }
        case "undefined":
        case "object": {
          if (crudFilter.value == null) {
            return {
              field: crudFilter.field,

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
          return {
            field: crudFilter.field,

            filter: {
              singleNumberFilter: {
                comparison: comparator,
                value: crudFilter.value,
              },
            },
          };
        }
        case "string": {
          if (!fieldTypes) {
            throw new Error(
              "Field types are required to filter a string by lt, gt, lte, or gte"
            );
          }
          switch (fieldTypes[crudFilter.field]) {
            case "date": {
              return {
                field: crudFilter.field,

                filter: {
                  singleDateFilter: {
                    comparison: comparator,
                    value: DateTime.fromISO(crudFilter.value),
                  },
                },
              };
            }
            case "string": {
              return {
                field: crudFilter.field,

                filter: {
                  singleStringFilter: {
                    comparison: comparator,
                    value: crudFilter.value,
                  },
                },
              };
            }
            default: {
              throw new Error("Unsupported field type");
            }
          }
        }
        default: {
          throw new Error("Unsupported filter value type");
        }
      }
    }
    case "in":
    case "nin": {
      return {
        field: crudFilter.field,

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
    }
    case "ina":
    case "nina": {
      throw new Error("Unsupported filter operator (n)ina");
    }
    case "contains":
    case "ncontains": {
      return {
        field: crudFilter.field,

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
    }
    case "containss":
    case "ncontainss": {
      return {
        field: crudFilter.field,
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
    }
    case "between":
    case "nbetween": {
      const [min, max] = crudFilter.value as [unknown, unknown];
      switch (typeof min) {
        case "number": {
          return {
            field: crudFilter.field,
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
        }
        case "string": {
          if (!fieldTypes) {
            throw new Error(
              "Field types are required to filter a string by between"
            );
          }
          switch (fieldTypes[crudFilter.field]) {
            case "date": {
              return {
                field: crudFilter.field,
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
            }
            default: {
              throw new Error("Unsupported field type");
            }
          }
        }
        default: {
          throw new Error("Unsupported filter value type");
        }
      }
    }
    case "null":
    case "nnull": {
      return {
        field: crudFilter.field,
        filter: {
          nullFilter: {
            comparison:
              crudFilter.operator === "nnull"
                ? NoTargetOperators.IS_NOT_NULL
                : NoTargetOperators.IS_NULL,
          },
        },
      };
    }
    case "startswith":
    case "nstartswith": {
      return {
        field: crudFilter.field,
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
    }
    case "startswiths":
    case "nstartswiths": {
      return {
        field: crudFilter.field,
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
    }
    case "endswith":
    case "nendswith": {
      return {
        field: crudFilter.field,
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
    }
    case "endswiths":
    case "nendswiths": {
      return {
        field: crudFilter.field,
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
    }
    default: {
      crudFilter.operator satisfies never;
      throw new Error("Unsupported filter operator");
    }
  }
}

export function crudFiltersToFilterObject(
  crudFilter: CrudFilter,
  fieldTypes: FieldTypes | undefined
): FilterGroup {
  const filters: FilterGroup["filters"] = [];
  const children: FilterGroup["children"] = [];
  if (crudFilter.operator === "or" || crudFilter.operator === "and") {
    children.push({
      operator:
        crudFilter.operator === "or"
          ? FilterGroupOperator.OR
          : FilterGroupOperator.AND,
      filters: [],
      children: crudFilter.value.map((f) =>
        crudFiltersToFilterObject(f, fieldTypes)
      ),
    });
  } else {
    filters.push(
      crudFilterToFilterObject(crudFilter as LogicalFilter, fieldTypes)
    );
  }
  return {
    operator:
      crudFilter.operator === "or"
        ? FilterGroupOperator.OR
        : FilterGroupOperator.AND,
    children,
    filters,
  };
}
