import {
  useForm,
  type UseFormProps,
  useSelect,
  type UseSelectReturnType,
  useTable,
  type useTableProps,
  type useTableReturnType,
} from "@refinedev/antd";
import type {
  BaseKey,
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
import type {
  AbstractSearchFilter,
  AbstractSortItem,
  FilterGroupOperator,
} from "@ukdanceblue/common";
import type { ResultOf, TadaDocumentNode, VariablesOf } from "gql.tada";
import type { DocumentNode } from "graphql";
import type { AnyVariables, UseQueryResponse } from "urql";

import { dataProvider, type FieldTypes } from "#config/refine/graphql/data.js";
import type { RefineResourceName } from "#config/refine/resources.js";

export interface UseTypedTableMeta<
  T extends Record<string, unknown>,
  Fields extends string,
> {
  targetPath?: string[];
  gqlQuery?: TadaDocumentNode<
    unknown,
    {
      page: number;
      pageSize: number;
      sortBy?: AbstractSortItem<Fields>[];
      filters?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: any[];
        operator: FilterGroupOperator;
      };
      search?: AbstractSearchFilter<Fields>;
    } & T
  >;
  gqlVariables?: T;
}

type PropsWithRequired<T> = T extends { id?: BaseKey }
  ? Omit<T, "id" | "resource"> & { id: string; resource: RefineResourceName }
  : T extends { resource?: string }
    ? Omit<T, "resource"> & { resource: RefineResourceName }
    : T;

interface TypedTableParams<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TSearchVariables extends Record<string, string> = Record<string, string>,
  TData extends BaseRecord = TQueryFnData,
  TExtraVariables extends Record<string, unknown> = Record<string, never>,
> extends UseTypedTableMeta<TExtraVariables, never> {
  fragment: Document;
  props: PropsWithRequired<
    useTableProps<TQueryFnData, HttpError, TSearchVariables, TData>
  >;
  fieldTypes?: FieldTypes;
}

export function useTypedTable<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TSearchVariables extends Record<string, string> = Record<string, string>,
  TData extends BaseRecord = TQueryFnData,
  TExtraVariables extends Record<string, unknown> = Record<string, never>,
>({
  fragment,
  props,
  fieldTypes,
  targetPath,
  gqlQuery,
  gqlVariables,
}: TypedTableParams<
  Document,
  TQueryFnData,
  TSearchVariables,
  TData,
  TExtraVariables
>): useTableReturnType<TData, HttpError, TSearchVariables> {
  return useTable({
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
      targetPath,
      gqlQuery,
      gqlVariables:
        props.meta?.gqlVariables || gqlVariables
          ? {
              ...props.meta?.gqlVariables,
              ...gqlVariables,
            }
          : undefined,
      gqlFragment: fragment,
      fieldTypes,
    },
  });
}

export function prefetchTypedTable<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TSearchVariables extends Record<string, string> = Record<string, string>,
  TData extends BaseRecord = TQueryFnData,
  TExtraVariables extends Record<string, unknown> = Record<string, never>,
>({
  fragment,
  props,
  fieldTypes,
  gqlQuery,
  gqlVariables,
  targetPath,
}: TypedTableParams<
  Document,
  TQueryFnData,
  TSearchVariables,
  TData,
  TExtraVariables
>) {
  return dataProvider.getList({
    resource: props.resource,
    filters: [
      ...(props.filters?.permanent ?? []),
      ...(props.filters?.initial ?? []),
    ],
    pagination: props.pagination,
    sorters: [
      ...(props.sorters?.permanent ?? []),
      ...(props.sorters?.initial ?? []),
    ],
    meta: {
      ...props.meta,
      targetPath,
      gqlQuery,
      gqlVariables:
        props.meta?.gqlVariables || gqlVariables
          ? {
              ...props.meta?.gqlVariables,
              ...gqlVariables,
            }
          : undefined,
      gqlFragment: fragment,
      fieldTypes,
    },
  });
}

interface TypedSelectParams<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TData extends BaseRecord = TQueryFnData,
> {
  fragment: Document;
  props: PropsWithRequired<UseSelectProps<TQueryFnData, HttpError, TData>>;
}

export function useTypedSelect<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TData extends BaseRecord = TQueryFnData,
  TOption extends BaseOption = BaseOption,
>({
  fragment,
  props,
}: TypedSelectParams<Document, TQueryFnData, TData>): UseSelectReturnType<
  TData,
  TOption
> {
  return useSelect({
    ...props,
    meta: {
      ...props.meta,
      gqlFragment: fragment,
    },
  });
}

export function prefetchTypedSelect<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TData extends BaseRecord = TQueryFnData,
>(params: TypedSelectParams<Document, TQueryFnData, TData>) {
  return dataProvider.getList({
    resource: params.props.resource,
    filters: params.props.filters,
    sorters: params.props.sorters,
    pagination: params.props.pagination,
    meta: {
      ...params.props.meta,
      gqlFragment: params.fragment,
    },
  });
}

type FormResult<D> = (D extends Record<`create${string}`, infer C>
  ? C
  : D extends Record<`set${string}`, infer S>
    ? S
    : never) &
  BaseRecord;

interface TypedFormParams<
  Document extends DocumentNode,
  FormData extends BaseRecord,
> {
  mutation: Document;
  props: UseFormProps<
    FormResult<ResultOf<Document>>,
    HttpError,
    FormData,
    FormData,
    FormResult<ResultOf<Document>>,
    HttpError
  > &
    (
      | {
          resource: RefineResourceName;
          action: "create";
        }
      | {
          resource: RefineResourceName;
          action: "edit";
          id: string;
        }
    );
  formToVariables: (
    formData: FormData
  ) => VariablesOf<Document> extends { input: infer T } ? T : never;
  dataToForm: (data: FormResult<ResultOf<Document>>) => FormData;
}

export function useTypedForm<
  Document extends DocumentNode,
  FormData extends BaseRecord,
>({
  mutation,
  props,
  formToVariables,
  dataToForm,
}: TypedFormParams<Document, FormData>) {
  const val = useForm<
    FormResult<ResultOf<Document>>,
    HttpError,
    FormData,
    FormData,
    FormResult<ResultOf<Document>>,
    HttpError
  >({
    ...props,
    queryOptions: {
      ...props.queryOptions,
      select(data) {
        return {
          data: dataToForm(data.data),
        };
      },
    },
    meta: {
      ...props.meta,
      gqlMutation: mutation,
    },
  });

  delete val.formProps.onFinish;

  return {
    ...val,
    onFinish: (values: FormData) => {
      // The types on refine's useForm hook don't allow this so we just give it the ol trust me bro
      return val.onFinish(formToVariables(values) as FormData);
    },
  };
}

export async function prefetchTypedForm<
  Document extends DocumentNode,
  FormData extends BaseRecord,
>(params: TypedFormParams<Document, FormData>) {
  if (!params.props.id) {
    return null;
  }
  const data = await dataProvider.getOne<FormResult<ResultOf<Document>>>({
    resource: params.props.resource,
    id: params.props.id,
    meta: {
      ...params.props.meta,
      gqlMutation: params.mutation,
    },
  });
  return { data: params.dataToForm(data.data) };
}

interface TypedCreateParams<
  Document extends DocumentNode,
  TData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
> {
  document: Document;
  props: PropsWithRequired<UseCreateProps<TData, HttpError, TVariables>>;
}

export function useTypedCreate<
  Document extends DocumentNode,
  TData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
>({
  document,
  props,
}: TypedCreateParams<Document, TData, TVariables>): UseCreateReturnType<
  TData,
  HttpError,
  TVariables
> {
  return useCreate({
    ...props,
    meta: {
      ...props.meta,
      gqlMutation: document,
    },
  });
}
interface TypedDeleteParams<
  Document extends DocumentNode,
  TData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
> {
  document: Document;
  props: PropsWithRequired<UseDeleteProps<TData, HttpError, TVariables>>;
}

export function useTypedDelete<
  Document extends DocumentNode,
  TData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
>({
  document,
  props,
}: TypedDeleteParams<Document, TData, TVariables>): UseDeleteReturnType<
  TData,
  HttpError,
  TVariables
> {
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

interface TypedOneParams<
  Document,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
> {
  fragment: Document;
  props: PropsWithRequired<UseOneProps<TQueryFnData, HttpError, TData>>;
}

export function useTypedOne<
  Document,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
>({ fragment, props }: TypedOneParams<Document, TQueryFnData, TData>) {
  return useOne({
    ...props,
    meta: {
      ...props.meta,
      gqlFragment: fragment,
    },
  });
}

export function prefetchTypedOne<
  Document,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
>({ fragment, props }: TypedOneParams<Document, TQueryFnData, TData>) {
  return dataProvider.getOne({
    resource: props.resource,
    id: props.id,
    meta: {
      ...props.meta,
      gqlFragment: fragment,
    },
  });
}

interface TypedCustomParams<
  Document extends DocumentNode,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
> {
  document: Document;
  gqlVariables?: Partial<VariablesOf<Document>>;
  props: Omit<
    UseCustomProps<TQueryFnData, HttpError, never, never, TData>,
    "method" | "url"
  >;
}

export function useTypedCustomQuery<
  Document extends DocumentNode,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
>({
  document,
  props,
  gqlVariables,
}: TypedCustomParams<Document, TQueryFnData, TData>) {
  return useCustom({
    method: "get",
    url: "",
    ...props,
    meta: {
      gqlQuery: document,
      gqlVariables: {
        ...props.meta?.gqlVariables,
        ...gqlVariables,
      },
      ...props.meta,
    },
  });
}

/**
 * @deprecated Replace with a more specific hook
 */
export function useQuery<Document extends DocumentNode>(props: {
  query: Document;
  pause?: boolean;
  variables?: VariablesOf<Document> & AnyVariables;
}): [
  UseQueryResponse<ResultOf<Document>, VariablesOf<Document> & AnyVariables>[0],
] {
  const val = useTypedCustomQuery({
    document: props.query,
    gqlVariables: props.variables,
    props: {
      queryOptions: {
        enabled: !props.pause,
      },
    },
  });

  return [
    {
      fetching: val.isLoading && !props.pause,
      hasNext: false,
      stale: false,
      data: val.data?.data,
      error: val.error
        ? {
            name: "RefineError",
            message: val.error.message,
            graphQLErrors: [],
            toString() {
              return this.message;
            },
          }
        : undefined,
    },
  ];
}

export function prefetchTypedCustomQuery<
  Document extends DocumentNode,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TData extends BaseRecord = TQueryFnData,
>({
  document,
  props,
  gqlVariables,
}: TypedCustomParams<Document, TQueryFnData, TData>) {
  return dataProvider.custom({
    method: "get",
    url: "",
    ...props,
    meta: {
      gqlQuery: document,
      gqlVariables: {
        ...props.meta?.gqlVariables,
        ...gqlVariables,
      },
      ...props.meta,
    },
  });
}

interface TypedCustomMutationParams<
  Document extends DocumentNode,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
> {
  document: Document;
  props: UseCustomMutationProps<TQueryFnData, HttpError, TVariables>;
}

export function useTypedCustomMutation<
  Document extends DocumentNode,
  TQueryFnData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
>({
  document,
  props,
}: TypedCustomMutationParams<
  Document,
  TQueryFnData,
  TVariables
>): UseCustomMutationReturnType<TQueryFnData, HttpError, TVariables> {
  return useCustomMutation({
    ...props,
    mutationOptions: {
      ...props.mutationOptions,
      meta: {
        gqlMutation: document,
        ...props.mutationOptions?.meta,
      },
    },
  });
}
