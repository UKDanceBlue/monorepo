import {
  useForm,
  type UseFormProps,
  type UseFormReturnType,
  useSelect,
  type UseSelectReturnType,
  useTable,
  type useTableProps,
  type useTableReturnType,
} from "@refinedev/antd";
import type {
  BaseOption,
  BaseRecord,
  CrudFilter,
  HttpError,
} from "@refinedev/core";
import {
  type UseCreateProps,
  type UseCreateReturnType,
  type UseCustomMutationProps,
  type UseCustomMutationReturnType,
  type UseCustomProps,
  type UseDeleteProps,
  type UseDeleteReturnType,
  type UseOneProps,
  type UseSelectProps,
} from "@refinedev/core";
import {
  useCreate,
  useCustom,
  useCustomMutation,
  useDelete,
  useOne,
} from "@refinedev/core";
import type { ResultOf, VariablesOf } from "gql.tada";
import type { DocumentNode } from "graphql";

import type { FieldTypes } from "#config/refine/graphql/data.ts";

export function useTypedTable<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TSearchVariables extends Record<string, string> = Record<string, string>,
  TData extends BaseRecord = TQueryFnData,
>(
  fragment: Document,
  props: useTableProps<TQueryFnData, HttpError, TSearchVariables, TData>,
  fieldTypes?: FieldTypes
): useTableReturnType<TData, HttpError, TSearchVariables> {
  return useTable({
    syncWithLocation: true,
    onSearch(data) {
      const filters: CrudFilter[] = [];
      for (const [key, value] of Object.entries(data)) {
        filters.push({
          field: key,
          operator: "contains",
          value: String(value),
        });
      }
      return filters;
    },
    ...props,
    meta: {
      ...props.meta,
      gqlFragment: fragment,
      fieldTypes,
    },
  });
}

export function useTypedSelect<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TData extends BaseRecord = TQueryFnData,
  TOption extends BaseOption = BaseOption,
>(
  fragment: Document,
  props: UseSelectProps<TQueryFnData, HttpError, TData>
): UseSelectReturnType<TData, TOption> {
  return useSelect({
    ...props,
    meta: {
      ...props.meta,
      gqlFragment: fragment,
    },
  });
}

export function useTypedForm<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
  TData extends BaseRecord = TQueryFnData,
>(
  fragment: Document,
  props: UseFormProps<
    TQueryFnData,
    HttpError,
    TVariables,
    TData,
    TData,
    HttpError
  >
): UseFormReturnType<
  TQueryFnData,
  HttpError,
  TVariables,
  TData,
  TData,
  HttpError
> {
  return useForm({
    ...props,
    meta: {
      ...props.meta,
      gqlFragment: fragment,
    },
  });
}

export function useTypedCreate<
  Document extends DocumentNode,
  TData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
>(
  document: Document,
  props: UseCreateProps<TData, HttpError, TVariables>
): UseCreateReturnType<TData, HttpError, TVariables> {
  return useCreate({
    ...props,
    meta: {
      ...props.meta,
      gqlMutation: document,
    },
  });
}

export function useTypedDelete<
  Document extends DocumentNode,
  TData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
>(
  document: Document,
  props: UseDeleteProps<TData, HttpError, TVariables>
): UseDeleteReturnType<TData, HttpError, TVariables> {
  return useDelete({
    ...props,
    mutationOptions: {
      ...props.mutationOptions,
      meta: {
        ...props.mutationOptions?.meta,
        gqlMutation: document,
      },
    },
  });
}

export function useTypedOne<
  Document,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
>(fragment: Document, props: UseOneProps<TQueryFnData, HttpError, TData>) {
  return useOne({
    ...props,
    meta: {
      ...props.meta,
      gqlFragment: fragment,
    },
  });
}

export function useTypedCustomQuery<
  Document extends DocumentNode,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
>(
  document: Document,
  props: UseCustomProps<TQueryFnData, HttpError, never, never, TData>
) {
  return useCustom({
    ...props,
    meta: {
      ...props.meta,
      gqlQuery: document,
    },
  });
}

export function useTypedCustomMutation<
  Document extends DocumentNode,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
>(
  document: Document,
  props: UseCustomMutationProps<TQueryFnData, HttpError, TVariables>
): UseCustomMutationReturnType<TQueryFnData, HttpError, TVariables> {
  return useCustomMutation({
    ...props,
    mutationOptions: {
      ...props.mutationOptions,
      meta: {
        ...props.mutationOptions?.meta,
        gqlMutation: document,
      },
    },
  });
}
