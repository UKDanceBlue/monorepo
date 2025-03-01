import { useSelect, type UseSelectReturnType } from "@refinedev/antd";
import type { BaseOption, BaseRecord, HttpError } from "@refinedev/core";
import { type UseSelectProps } from "@refinedev/core";
import type { ResultOf } from "gql.tada";

import { dataProvider } from "#config/refine/graphql/data.js";

import type { PropsWithRequired } from "./core.js";

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
