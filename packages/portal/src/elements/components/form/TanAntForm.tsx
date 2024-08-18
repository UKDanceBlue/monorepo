import type { FormApi } from "@tanstack/react-form";
import { Form, type FormProps } from "antd";

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
    <Form onFinish={() => formApi.handleSubmit()} {...antProps}>
      {children}
    </Form>
  );
}
