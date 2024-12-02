import { NumberOutlined, SearchOutlined } from "@ant-design/icons";
import type {
  NumericFilterItemInterface,
  StringFilterItemInterface,
} from "@ukdanceblue/common";
import { NumericComparator } from "@ukdanceblue/common";
import { Input, type InputRef, Select, Space } from "antd";
import { useEffect, useRef, useState } from "react";

import { FilterSearchDropdown } from "#elements/components/FilterDropdown.js";

export function useMakeStringSearchFilterProps<Field extends string>(
  field: Field,
  updateFilter:
    | ((field: Field, filter: StringFilterItemInterface<Field>) => void)
    | undefined,
  clearFilter: ((field: Field) => void) | undefined,
  placeholderText?: string | false
) {
  const focusRef = useRef<InputRef | undefined>(undefined);

  if (!updateFilter || !clearFilter) {
    return {};
  }

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
      <SearchOutlined color={filtered ? "#1890ff" : undefined} />
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

  const [mode, setMode] = useState<NumericComparator>(
    NumericComparator.GREATER_THAN_OR_EQUAL_TO
  );
  const [val, setVal] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!val) {
      clearFilter(field);
    } else {
      updateFilter(field, {
        comparison: mode,
        field,
        value: val,
      });
    }
  }, [val, mode, clearFilter, field, updateFilter]);

  return {
    filterDropdown: () => (
      <Space.Compact>
        <Select
          value={mode}
          onChange={(value) => {
            setMode(value);
          }}
        >
          <Select.Option value={NumericComparator.EQUALS}>=</Select.Option>
          <Select.Option value={NumericComparator.GREATER_THAN}>
            {">"}
          </Select.Option>
          <Select.Option value={NumericComparator.LESS_THAN}>
            {"<"}
          </Select.Option>
          <Select.Option value={NumericComparator.GREATER_THAN_OR_EQUAL_TO}>
            {"≥"}
          </Select.Option>
          <Select.Option value={NumericComparator.LESS_THAN_OR_EQUAL_TO}>
            {"≤"}
          </Select.Option>
        </Select>
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
              setVal(value);
            }
          }}
        />
      </Space.Compact>
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
