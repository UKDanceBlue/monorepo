import type { StringFilterItemInterface } from "@ukdanceblue/common";
import { StringComparator } from "@ukdanceblue/common";
import type { InputRef } from "antd";
import Search from "antd/es/input/Search";

export function FilterSearchDropdown<Field extends string>({
  updateFilter,
  clearFilter,
  field,
  placeholderText = `Search ${field}`,
  inputRef,
}: {
  updateFilter: (
    field: Field,
    filter: StringFilterItemInterface<Field>
  ) => void;
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
            comparison: StringComparator.SUBSTRING,
            field,
            value,
          });
        } else {
          clearFilter(field);
        }
      }}
      ref={inputRef}
    />
  );
}
