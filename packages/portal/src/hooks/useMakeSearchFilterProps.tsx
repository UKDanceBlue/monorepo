import { SearchOutlined } from "@ant-design/icons";
import { FilterSearchDropdown } from "@elements/components/FilterDropdown";
import type { StringFilterItemInterface } from "@ukdanceblue/common";
import type { InputRef } from "antd";
import { useRef } from "react";

export function useMakeSearchFilterProps<Field extends string>(
  field: Field,
  updateFilter: (
    field: Field,
    filter: StringFilterItemInterface<Field>
  ) => void,
  clearFilter: (field: Field) => void,
  placeholderText?: string | false
) {
  const focusRef = useRef<InputRef | undefined>(undefined);

  return {
    filterDropdown: () => (
      <FilterSearchDropdown
        updateFilter={updateFilter}
        clearFilter={clearFilter}
        field={field}
        placeholderText={placeholderText}
        inputRef={(inputRef) => {
          focusRef.current = inputRef;
        }}
      />
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilterDropdownOpenChange: () => {
      setTimeout(() => {
        focusRef.current?.focus();
      }, 100);
    },
  };
}
