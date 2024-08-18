import {
  Comparator,
  IsComparator,
  NumericComparator,
  SortDirection,
  StringComparator,
} from "../ListQueryTypes.js";

import { registerEnumType } from "type-graphql";


registerEnumType(SortDirection, { name: "SortDirection" });
registerEnumType(Comparator, { name: "Comparator" });
registerEnumType(IsComparator, { name: "IsComparator" });
registerEnumType(StringComparator, { name: "StringComparator" });
registerEnumType(NumericComparator, { name: "NumericComparator" });

export const DEFAULT_PAGE_SIZE = 10;
export const FIRST_PAGE = 1;
