import type {
  FilterItem,
  IsComparator,
  NumericComparator,
  StringComparator,
} from "./ListQueryTypes.js";

export interface BooleanFilterItemInterface<Field extends string>
  extends FilterItem<Field, boolean> {
  value: boolean;
  comparison: IsComparator;
}

export interface DateFilterItemInterface<Field extends string>
  extends FilterItem<Field, string> {
  value: string;
  comparison: NumericComparator;
}

export interface NumericFilterItemInterface<Field extends string>
  extends FilterItem<Field, number> {
  value: number;
  comparison: NumericComparator;
}

export interface StringFilterItemInterface<Field extends string>
  extends FilterItem<Field, string> {
  value: string;
  comparison: StringComparator;
}

export interface OneOfFilterItemInterface<Field extends string>
  extends FilterItem<Field, readonly string[]> {
  value: readonly string[];
  comparison?: never;
}

export interface IsNullFilterItemInterface<Field extends string>
  extends FilterItem<Field, null> {
  value?: never;
  comparison?: never;
}
