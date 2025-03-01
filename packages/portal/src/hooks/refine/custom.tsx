import type { BaseRecord, HttpError } from "@refinedev/core";
import { type UseCustomProps } from "@refinedev/core";
import { useCustom } from "@refinedev/core";
import type { ResultOf, VariablesOf } from "gql.tada";
import type { DocumentNode } from "graphql";
import type { AnyVariables, UseQueryResponse } from "urql";

import { dataProvider } from "#config/refine/graphql/data.js";

interface TypedCustomParams<
  Document extends DocumentNode,
  TData extends BaseRecord,
> {
  document: Document;
  gqlVariables?: Partial<VariablesOf<Document>>;
  props: Omit<
    UseCustomProps<
      BaseRecord & ResultOf<Document>,
      HttpError,
      VariablesOf<Document>,
      VariablesOf<Document>,
      TData
    >,
    "method" | "url"
  >;
}

export function useTypedCustomQuery<
  Document extends DocumentNode,
  TData extends BaseRecord = BaseRecord & ResultOf<Document>,
>({ document, props, gqlVariables }: TypedCustomParams<Document, TData>) {
  return useCustom<
    ResultOf<Document> & BaseRecord,
    HttpError,
    VariablesOf<Document>,
    VariablesOf<Document>,
    TData
  >({
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
  TData extends BaseRecord = BaseRecord & ResultOf<Document>,
>({ document, props, gqlVariables }: TypedCustomParams<Document, TData>) {
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
