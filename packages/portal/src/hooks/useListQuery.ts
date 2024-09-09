import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  BooleanFilterItemInterface,
  DateFilterItemInterface,
  IsNullFilterItemInterface,
  NumericFilterItemInterface,
  OneOfFilterItemInterface,
  PaginationOptions,
  SortDirection,
  SortingOptions,
  StringFilterItemInterface,
} from "@ukdanceblue/common";
import type { Dispatch, SetStateAction } from "react";

interface FilterObject<
  DateFields extends string,
  IsNullFields extends string,
  NumericFields extends string,
  OneOfFields extends string,
  StringFields extends string,
  BooleanFields extends string,
> {
  dateFilters: DateFilterItemInterface<DateFields>[];
  isNullFilters: IsNullFilterItemInterface<IsNullFields>[];
  numericFilters: NumericFilterItemInterface<NumericFields>[];
  oneOfFilters: OneOfFilterItemInterface<OneOfFields>[];
  stringFilters: StringFilterItemInterface<StringFields>[];
  booleanFilters: BooleanFilterItemInterface<BooleanFields>[];
}

type ListQueryOptions<
  DateFields extends string,
  IsNullFields extends string,
  NumericFields extends string,
  OneOfFields extends string,
  StringFields extends string,
  BooleanFields extends string,
> = PaginationOptions &
  SortingOptions &
  FilterObject<
    DateFields,
    IsNullFields,
    NumericFields,
    OneOfFields,
    StringFields,
    BooleanFields
  >;

interface SortOption<Field> {
  field: Field;
  direction: SortDirection;
}

export function useListQuery<
  AllFields extends string,
  DateFields extends AllFields,
  NumericFields extends AllFields,
  StringFields extends AllFields,
  OneOfFields extends AllFields,
  IsNullFields extends AllFields,
  BooleanFields extends AllFields,
>(
  {
    initPage,
    initPageSize,
    initSorting,
  }: {
    initPage: number;
    initPageSize: number;
    initSorting: SortOption<AllFields>[];
  },
  {
    dateFields = [],
    numericFields = [],
    stringFields = [],
    oneOfFields = [],
    isNullFields = [],
    booleanFields = [],
  }: {
    allFields: AllFields[];
    dateFields: DateFields[];
    numericFields: NumericFields[];
    stringFields: StringFields[];
    oneOfFields: OneOfFields[];
    isNullFields: IsNullFields[];
    booleanFields: BooleanFields[];
  }
): {
  queryOptions: ListQueryOptions<
    DateFields,
    IsNullFields,
    NumericFields,
    OneOfFields,
    StringFields,
    BooleanFields
  >;
  updatePagination: (paginationOptions: {
    page?: number | undefined;
    pageSize?: number | undefined;
  }) => void;
  setSorting: Dispatch<SetStateAction<SortOption<AllFields>[]>>;
  pushSorting: (sortingOption: SortOption<AllFields>) => void;
  clearSorting: () => void;
  updateFilter: <Field extends AllFields>(
    field: Field,
    filter: Field extends DateFields
      ? DateFilterItemInterface<Field>
      : Field extends IsNullFields
        ? IsNullFilterItemInterface<Field>
        : Field extends NumericFields
          ? NumericFilterItemInterface<Field>
          : Field extends OneOfFields
            ? OneOfFilterItemInterface<Field>
            : Field extends StringFields
              ? StringFilterItemInterface<Field>
              : Field extends BooleanFields
                ? BooleanFilterItemInterface<Field>
                : never
  ) => void;
  clearFilter: (field: AllFields) => void;
  clearFilters: () => void;
} {
  const [initSortDirection, initSortBy] = useMemo(() => {
    const initSortDirection: SortDirection[] = [];
    const initSortBy: AllFields[] = [];
    for (const sortOption of initSorting) {
      initSortDirection.push(sortOption.direction);
      initSortBy.push(sortOption.field);
    }
    return [initSortDirection, initSortBy];
  }, [initSorting]);

  const [queryOptions, setQueryOptions] = useState<
    ListQueryOptions<
      DateFields,
      IsNullFields,
      NumericFields,
      OneOfFields,
      StringFields,
      BooleanFields
    >
  >({
    page: initPage,
    pageSize: initPageSize,
    sortBy: initSortBy,
    sortDirection: initSortDirection,
    dateFilters: [],
    isNullFilters: [],
    numericFilters: [],
    oneOfFilters: [],
    stringFilters: [],
    booleanFilters: [],
  });

  const [page, setPage] = useState<number>(initPage);
  const [pageSize, setPageSize] = useState<number>(initPageSize);
  const [sorting, setSorting] = useState<SortOption<AllFields>[]>(initSorting);
  const [dateFilters, setDateFilters] = useState<
    DateFilterItemInterface<DateFields>[]
  >([]);
  const [isNullFilters, setIsNullFilters] = useState<
    IsNullFilterItemInterface<IsNullFields>[]
  >([]);
  const [numericFilters, setNumericFilters] = useState<
    NumericFilterItemInterface<NumericFields>[]
  >([]);
  const [oneOfFilters, setOneOfFilters] = useState<
    OneOfFilterItemInterface<OneOfFields>[]
  >([]);
  const [stringFilters, setStringFilters] = useState<
    StringFilterItemInterface<StringFields>[]
  >([]);
  const [booleanFilters, setBooleanFilters] = useState<
    BooleanFilterItemInterface<BooleanFields>[]
  >([]);

  useEffect(() => {
    const sortDirection: SortDirection[] = [];
    const sortBy: AllFields[] = [];

    for (const sortOption of sorting) {
      sortDirection.push(sortOption.direction);
      sortBy.push(sortOption.field);
    }

    setQueryOptions({
      page,
      pageSize,
      sortBy,
      sortDirection,
      dateFilters,
      isNullFilters,
      numericFilters,
      oneOfFilters,
      stringFilters,
      booleanFilters,
    });
  }, [
    page,
    pageSize,
    sorting,
    dateFilters,
    isNullFilters,
    numericFilters,
    oneOfFilters,
    stringFilters,
    booleanFilters,
  ]);

  const updatePagination = useCallback(
    (paginationOptions: {
      page?: number | undefined;
      pageSize?: number | undefined;
    }) => {
      if (paginationOptions.page != null) {
        setPage(paginationOptions.page);
      }
      if (paginationOptions.pageSize != null) {
        setPageSize(paginationOptions.pageSize);
      }
    },
    []
  );

  const pushSorting = useCallback((sortingOption: SortOption<AllFields>) => {
    setSorting((prevSorting) => [
      sortingOption,
      ...prevSorting.filter(
        (sortOption) => sortOption.field !== sortingOption.field
      ),
    ]);
  }, []);

  const clearSorting = useCallback(() => {
    setSorting([]);
  }, []);

  const updateFilter = useCallback(
    <
      Field extends
        | DateFields
        | IsNullFields
        | NumericFields
        | OneOfFields
        | StringFields
        | BooleanFields,
    >(
      field: Field,
      filter: Field extends DateFields
        ? DateFilterItemInterface<Field>
        : Field extends IsNullFields
          ? IsNullFilterItemInterface<Field>
          : Field extends NumericFields
            ? NumericFilterItemInterface<Field>
            : Field extends OneOfFields
              ? OneOfFilterItemInterface<Field>
              : Field extends StringFields
                ? StringFilterItemInterface<Field>
                : Field extends BooleanFields
                  ? BooleanFilterItemInterface<Field>
                  : never
    ) => {
      if (dateFields.includes(field as never)) {
        setDateFilters((dateFilters) => {
          const newDateFilters = [...dateFilters];
          const index = newDateFilters.findIndex(
            (dateFilter) => dateFilter.field === field
          );
          if (index === -1) {
            newDateFilters.push(filter as DateFilterItemInterface<DateFields>);
          } else {
            newDateFilters[index] =
              filter as DateFilterItemInterface<DateFields>;
          }
          return newDateFilters;
        });
      } else if (isNullFields.includes(field as never)) {
        setIsNullFilters((isNullFilters) => {
          const newIsNullFilters = [...isNullFilters];
          const index = newIsNullFilters.findIndex(
            (isNullFilter) => isNullFilter.field === field
          );
          if (index === -1) {
            newIsNullFilters.push(
              filter as IsNullFilterItemInterface<IsNullFields>
            );
          } else {
            newIsNullFilters[index] =
              filter as IsNullFilterItemInterface<IsNullFields>;
          }
          return newIsNullFilters;
        });
      } else if (numericFields.includes(field as never)) {
        setNumericFilters((numericFilters) => {
          const newNumericFilters = [...numericFilters];
          const index = newNumericFilters.findIndex(
            (numericFilter) => numericFilter.field === field
          );
          if (index === -1) {
            newNumericFilters.push(
              filter as NumericFilterItemInterface<NumericFields>
            );
          } else {
            newNumericFilters[index] =
              filter as NumericFilterItemInterface<NumericFields>;
          }
          return newNumericFilters;
        });
      } else if (oneOfFields.includes(field as never)) {
        setOneOfFilters((oneOfFilters) => {
          const newOneOfFilters = [...oneOfFilters];
          const index = newOneOfFilters.findIndex(
            (oneOfFilter) => oneOfFilter.field === field
          );
          if (index === -1) {
            newOneOfFilters.push(
              filter as OneOfFilterItemInterface<OneOfFields>
            );
          } else {
            newOneOfFilters[index] =
              filter as OneOfFilterItemInterface<OneOfFields>;
          }
          return newOneOfFilters;
        });
      } else if (stringFields.includes(field as never)) {
        setStringFilters((stringFilters) => {
          const newStringFilters = [...stringFilters];
          const index = newStringFilters.findIndex(
            (stringFilter) => stringFilter.field === field
          );
          if (index === -1) {
            newStringFilters.push(
              filter as StringFilterItemInterface<StringFields>
            );
          } else {
            newStringFilters[index] =
              filter as StringFilterItemInterface<StringFields>;
          }
          return newStringFilters;
        });
      } else if (booleanFields.includes(field as never)) {
        setBooleanFilters((booleanFilters) => {
          const newBooleanFilters = [...booleanFilters];
          const index = newBooleanFilters.findIndex(
            (booleanFilter) => booleanFilter.field === field
          );
          if (index === -1) {
            newBooleanFilters.push(
              filter as BooleanFilterItemInterface<BooleanFields>
            );
          } else {
            newBooleanFilters[index] =
              filter as BooleanFilterItemInterface<BooleanFields>;
          }
          return newBooleanFilters;
        });
      }
    },
    [
      dateFields,
      isNullFields,
      numericFields,
      oneOfFields,
      stringFields,
      booleanFields,
    ]
  );

  const clearFilter = useCallback(
    (field: AllFields) => {
      if (dateFields.includes(field as never)) {
        setDateFilters((dateFilters) =>
          dateFilters.filter((dateFilter) => dateFilter.field !== field)
        );
      } else if (isNullFields.includes(field as never)) {
        setIsNullFilters((isNullFilters) =>
          isNullFilters.filter((isNullFilter) => isNullFilter.field !== field)
        );
      } else if (numericFields.includes(field as never)) {
        setNumericFilters((numericFilters) =>
          numericFilters.filter(
            (numericFilter) => numericFilter.field !== field
          )
        );
      } else if (oneOfFields.includes(field as never)) {
        setOneOfFilters((oneOfFilters) =>
          oneOfFilters.filter((oneOfFilter) => oneOfFilter.field !== field)
        );
      } else if (stringFields.includes(field as never)) {
        setStringFilters((stringFilters) =>
          stringFilters.filter((stringFilter) => stringFilter.field !== field)
        );
      } else if (booleanFields.includes(field as never)) {
        setBooleanFilters((booleanFilters) =>
          booleanFilters.filter(
            (booleanFilter) => booleanFilter.field !== field
          )
        );
      }
    },
    [
      dateFields,
      isNullFields,
      numericFields,
      oneOfFields,
      stringFields,
      booleanFields,
    ]
  );

  const clearFilters = useCallback(() => {
    setDateFilters([]);
    setIsNullFilters([]);
    setNumericFilters([]);
    setOneOfFilters([]);
    setStringFilters([]);
    setBooleanFilters([]);
  }, []);

  return {
    queryOptions,
    updatePagination,
    setSorting,
    pushSorting,
    clearSorting,
    updateFilter,
    clearFilter,
    clearFilters,
  };
}
