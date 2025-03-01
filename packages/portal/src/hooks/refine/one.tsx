import type { BaseRecord, HttpError } from "@refinedev/core";
import { type UseOneProps } from "@refinedev/core";
import { useOne } from "@refinedev/core";
import type { ResultOf } from "gql.tada";

import { dataProvider } from "#config/refine/graphql/data.js";

import type { PropsWithRequired } from "./core";

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
