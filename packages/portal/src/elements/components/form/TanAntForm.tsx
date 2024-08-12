import { Form, type FormProps } from "antd";

import type { FormApi } from "@tanstack/react-form";

interface TanAntFormProps<Values> extends FormProps<never> {
  fields?: never;
  onFinish?: never;
  formApi: FormApi<Values>;
  children: React.ReactNode;
}

export function TanAntForm<Values>({
  formApi,
  children,
  ...antProps
}: TanAntFormProps<Values>) {
  return (
    <formApi.Provider>
      <Form onFinish={() => formApi.handleSubmit()} {...antProps}>
        {children}
      </Form>
    </formApi.Provider>
  );
}
