import type {
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
import { useCallback, useEffect, useMemo, useState } from "react";

type FilterObject<
  DateFields extends string,
  IsNullFields extends string,
  NumericFields extends string,
  OneOfFields extends string,
  StringFields extends string,
> = {
  dateFilters: DateFilterItemInterface<DateFields>[];
  isNullFilters: IsNullFilterItemInterface<IsNullFields>[];
  numericFilters: NumericFilterItemInterface<NumericFields>[];
  oneOfFilters: OneOfFilterItemInterface<OneOfFields>[];
  stringFilters: StringFilterItemInterface<StringFields>[];
};

type ListQueryOptions<
  DateFields extends string,
  IsNullFields extends string,
  NumericFields extends string,
  OneOfFields extends string,
  StringFields extends string,
> = PaginationOptions &
  SortingOptions &
  FilterObject<
    DateFields,
    IsNullFields,
    NumericFields,
    OneOfFields,
    StringFields
  >;

type SortOption<Field> = {
  field: Field;
  direction: SortDirection;
};

export function useListQuery<
  AllFields extends string,
  DateFields extends AllFields,
  NumericFields extends AllFields,
  StringFields extends AllFields,
  OneOfFields extends AllFields,
  IsNullFields extends AllFields,
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
    dateFields,
    numericFields,
    stringFields,
    oneOfFields,
    isNullFields,
  }: {
    allFields: AllFields[];
    dateFields: DateFields[];
    numericFields: NumericFields[];
    stringFields: StringFields[];
    oneOfFields: OneOfFields[];
    isNullFields: IsNullFields[];
  }
): {
  queryOptions: ListQueryOptions<
    DateFields,
    IsNullFields,
    NumericFields,
    OneOfFields,
    StringFields
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
      StringFields
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

  const pushSorting = useCallback(
    (sortingOption: SortOption<AllFields>) => {
      setSorting([
        sortingOption,
        ...sorting.filter(
          (sortOption) => sortOption.field !== sortingOption.field
        ),
      ]);
    },
    [sorting]
  );

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
        | StringFields,
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
        : never
    ) => {
      if (dateFields.includes(field as never)) {
        const newDateFilters = [...dateFilters];
        const index = newDateFilters.findIndex(
          (dateFilter) => dateFilter.field === field
        );
        if (index === -1) {
          newDateFilters.push(filter as DateFilterItemInterface<DateFields>);
        } else {
          newDateFilters[index] = filter as DateFilterItemInterface<DateFields>;
        }
        setDateFilters(newDateFilters);
      } else if (isNullFields.includes(field as never)) {
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
        setIsNullFilters(newIsNullFilters);
      } else if (numericFields.includes(field as never)) {
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
        setNumericFilters(newNumericFilters);
      } else if (oneOfFields.includes(field as never)) {
        const newOneOfFilters = [...oneOfFilters];
        const index = newOneOfFilters.findIndex(
          (oneOfFilter) => oneOfFilter.field === field
        );
        if (index === -1) {
          newOneOfFilters.push(filter as OneOfFilterItemInterface<OneOfFields>);
        } else {
          newOneOfFilters[index] =
            filter as OneOfFilterItemInterface<OneOfFields>;
        }
        setOneOfFilters(newOneOfFilters);
      } else if (stringFields.includes(field as never)) {
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
        setStringFilters(newStringFilters);
      }
    },
    [
      dateFields,
      dateFilters,
      isNullFields,
      isNullFilters,
      numericFields,
      numericFilters,
      oneOfFields,
      oneOfFilters,
      stringFields,
      stringFilters,
    ]
  );

  const clearFilter = useCallback(
    (field: AllFields) => {
      if (dateFields.includes(field as never)) {
        setDateFilters(
          dateFilters.filter((dateFilter) => dateFilter.field !== field)
        );
      } else if (isNullFields.includes(field as never)) {
        setIsNullFilters(
          isNullFilters.filter((isNullFilter) => isNullFilter.field !== field)
        );
      } else if (numericFields.includes(field as never)) {
        setNumericFilters(
          numericFilters.filter(
            (numericFilter) => numericFilter.field !== field
          )
        );
      } else if (oneOfFields.includes(field as never)) {
        setOneOfFilters(
          oneOfFilters.filter((oneOfFilter) => oneOfFilter.field !== field)
        );
      } else if (stringFields.includes(field as never)) {
        setStringFilters(
          stringFilters.filter((stringFilter) => stringFilter.field !== field)
        );
      }
    },
    [
      dateFields,
      dateFilters,
      isNullFields,
      isNullFilters,
      numericFields,
      numericFilters,
      oneOfFields,
      oneOfFilters,
      stringFields,
      stringFilters,
    ]
  );

  const clearFilters = useCallback(() => {
    setDateFilters([]);
    setIsNullFilters([]);
    setNumericFilters([]);
    setOneOfFilters([]);
    setStringFilters([]);
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
