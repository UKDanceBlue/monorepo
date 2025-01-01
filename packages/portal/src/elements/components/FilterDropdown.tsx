import { SingleTargetOperators } from "@ukdanceblue/common";
import type { InputRef } from "antd";
import Search from "antd/es/input/Search.js";

import type { FilterItem } from "#config/refine/graphql/crudFiltersToFilterObject.ts";

export function FilterSearchDropdown<Field extends string>({
  updateFilter,
  clearFilter,
  field,
  placeholderText = `Search ${field}`,
  inputRef,
}: {
  updateFilter: (field: Field, filter: FilterItem) => void;
  clearFilter: (field: Field) => void;
  field: Field;
  placeholderText?: string | undefined | false;
  inputRef?: (ref: InputRef) => void;
}) {
  return (
    <Search
      placeholder={placeholderText || undefined}
      onSearch={(value) => {
        if (value) {
          updateFilter(field, {
            field,
            filter: {
              singleStringFilter: {
                comparison: SingleTargetOperators.INSENSITIVE_CONTAINS,
                value,
              },
            },
          });
        } else {
          clearFilter(field);
        }
      }}
      ref={inputRef}
    />
  );
}
