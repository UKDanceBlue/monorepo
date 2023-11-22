import type { StringFilterItemInterface } from "@ukdanceblue/common";
import { StringComparator } from "@ukdanceblue/common";
import Search from "antd/es/input/Search";

export function FilterSearchDropdown<Field extends string>({
  updateFilter,
  clearFilter,
  field,
  placeholderText = `Search ${field}`,
}: {
  updateFilter: (
    field: Field,
    filter: StringFilterItemInterface<Field>
  ) => void;
  clearFilter: (field: Field) => void;
  field: Field;
  placeholderText?: string | false;
}) {
  return (
    <Search
      placeholder={placeholderText || undefined}
      onSearch={(value) => {
        if (value) {
          updateFilter(field, {
            comparison: StringComparator.ILIKE,
            field,
            value: `%${value}%`,
          });
        } else {
          clearFilter(field);
        }
      }}
    />
  );
}
