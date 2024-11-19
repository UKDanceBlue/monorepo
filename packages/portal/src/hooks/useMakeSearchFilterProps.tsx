import { NumberOutlined, SearchOutlined } from "@ant-design/icons";
import type {
  NumericFilterItemInterface,
  StringFilterItemInterface,
} from "@ukdanceblue/common";
import { NumericComparator } from "@ukdanceblue/common";
import { Input, type InputRef } from "antd";
import { useRef } from "react";

import { FilterSearchDropdown } from "@/elements/components/FilterDropdown.js";

export function useMakeStringSearchFilterProps<Field extends string>(
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
    filterDropdownProps: {
      onOpenChange: () => {
        setTimeout(() => {
          focusRef.current?.focus();
        }, 100);
      },
    },
  };
}

export function useMakeNumberSearchFilterProps<Field extends string>(
  field: Field,
  updateFilter: (
    field: Field,
    filter: NumericFilterItemInterface<Field>
  ) => void,
  clearFilter: (field: Field) => void,
  integerOnly = false
) {
  const focusRef = useRef<InputRef | undefined>(undefined);

  return {
    filterDropdown: () => (
      <Input
        ref={(inputRef) => {
          focusRef.current = inputRef ?? undefined;
        }}
        placeholder="Search"
        onPressEnter={(e) => {
          let value = Number.NaN;
          if (e.currentTarget.value) {
            value = integerOnly
              ? Number.parseInt(e.currentTarget.value, 10)
              : Number.parseFloat(e.currentTarget.value);
          }
          if (Number.isNaN(value)) {
            clearFilter(field);
          } else {
            updateFilter(field, {
              comparison: NumericComparator.EQUALS,
              field,
              value,
            });
          }
        }}
      />
    ),
    filterIcon: (filtered: boolean) => (
      <NumberOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange: () => {
        setTimeout(() => {
          focusRef.current?.focus();
        }, 100);
      },
    },
  };
}
