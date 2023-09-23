/*
 * THIS FILE IS CURRENTLY NOT USED
 * it is just a reference for future work
 */

import type { Comparator } from "../../util/TypeUtils.js";

interface SearchEntryBase<
  FieldName extends string,
  FieldValueType extends string | number | boolean
> {
  field: FieldName;
  value: FieldValueType;
  comparison: Comparator;
}

export interface StringSearchEntry<FieldName extends string>
  extends SearchEntryBase<FieldName, string> {
  comparison: typeof Comparator["EQUALS"] | typeof Comparator["INCLUDES"];
}

export interface NumericSearchEntry<FieldName extends string>
  extends SearchEntryBase<FieldName, number> {
  comparison:
  | typeof Comparator["EQUALS"]
  | typeof Comparator["GREATER_THAN"]
  | typeof Comparator["LESS_THAN"]
  | typeof Comparator["GREATER_THAN_OR_EQUAL_TO"]
  | typeof Comparator["LESS_THAN_OR_EQUAL_TO"];
}

export interface BooleanSearchEntry<FieldName extends string>
  extends SearchEntryBase<FieldName, boolean> {
  comparison: typeof Comparator["EQUALS"];
}

export type SearchEntry<FieldName extends string = string> =
  | StringSearchEntry<FieldName>
  | NumericSearchEntry<FieldName>
  | BooleanSearchEntry<FieldName>;
