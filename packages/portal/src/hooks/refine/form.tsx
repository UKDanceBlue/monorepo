import { useForm, type UseFormProps } from "@refinedev/antd";
import type { BaseRecord, HttpError } from "@refinedev/core";
import type { ResultOf, VariablesOf } from "gql.tada";
import type { DocumentNode } from "graphql";

import { dataProvider } from "#config/refine/graphql/data.js";
import { type RefineResourceName } from "#config/refine/resources.js";

type FormResult<D> = D[keyof D];

interface TypedFormParams<
  Document extends DocumentNode,
  FormData extends BaseRecord,
> {
  mutation: Document;
  props: UseFormProps<
    FormResult<ResultOf<Document>> & BaseRecord,
    HttpError,
    FormData,
    FormData,
    FormResult<ResultOf<Document>> & BaseRecord,
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
  dataToForm: (data: Exclude<FormResult<ResultOf<Document>>, null>) => FormData;
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
    FormResult<ResultOf<Document>> & BaseRecord,
    HttpError,
    FormData,
    FormData,
    FormResult<ResultOf<Document>> & BaseRecord,
    HttpError
  >({
    ...props,
    queryOptions: {
      ...props.queryOptions,
      select(data) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (data.data === null) {
          throw new Error("Record is null");
        }
        return {
          data: dataToForm(
            data.data as Exclude<FormResult<ResultOf<Document>>, null>
          ),
        };
      },
    },
    meta: {
      ...props.meta,
      gqlMutation: mutation,
    },
  });

  const onFinish = (values: FormData) => {
    // The types on refine's useForm hook don't allow this so we just give it the ol trust me bro
    return val.onFinish(formToVariables(values) as FormData);
  };

  return {
    ...val,
    formProps: {
      ...val.formProps,
      onFinish,
    },
    onFinish,
  };
}

export async function prefetchTypedForm<
  Document extends DocumentNode,
  FormData extends BaseRecord,
>(params: TypedFormParams<Document, FormData>) {
  if (!params.props.id) {
    return null;
  }
  const data = await dataProvider.getOne<
    FormResult<ResultOf<Document> & BaseRecord>
  >({
    resource: params.props.resource,
    id: params.props.id,
    meta: {
      ...params.props.meta,
      gqlMutation: params.mutation,
    },
  });
  return { data: params.dataToForm(data.data) };
}
