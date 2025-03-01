import type { BaseRecord, HttpError } from "@refinedev/core";
import { type UseCreateProps, type UseCreateReturnType } from "@refinedev/core";
import { useCreate } from "@refinedev/core";
import type { ResultOf, VariablesOf } from "gql.tada";
import type { DocumentNode } from "graphql";

import type { PropsWithRequired } from "./core.js";

interface TypedCreateParams<
  Document extends DocumentNode,
  TData extends BaseRecord & ResultOf<Document> = BaseRecord &
    ResultOf<Document>,
  TVariables extends VariablesOf<Document> = VariablesOf<Document>,
> {
  document: Document;
  props: PropsWithRequired<
    UseCreateProps<
      TData,
      HttpError,
      TVariables extends { input: infer T } ? T : TVariables
    >
  >;
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
  TVariables extends { input: infer T } ? T : TVariables
> {
  return useCreate({
    ...props,
    meta: {
      ...props.meta,
      gqlMutation: document,
    },
  });
}
