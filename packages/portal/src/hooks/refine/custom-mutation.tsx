import type { BaseRecord, HttpError } from "@refinedev/core";
import {
  type UseCustomMutationProps,
  type UseCustomMutationReturnType,
} from "@refinedev/core";
import { useCustomMutation } from "@refinedev/core";
import type { ResultOf, VariablesOf } from "gql.tada";
import type { DocumentNode } from "graphql";

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
