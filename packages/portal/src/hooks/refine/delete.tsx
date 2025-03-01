import type { BaseRecord, HttpError } from "@refinedev/core";
import { type UseDeleteProps, type UseDeleteReturnType } from "@refinedev/core";
import { useDelete } from "@refinedev/core";
import type { ResultOf, VariablesOf } from "gql.tada";
import type { DocumentNode } from "graphql";

import type { PropsWithRequired } from "./core";

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
