import { Form, type FormProps } from "antd";

interface TanAntFormProps extends FormProps<never> {
  fields?: never;
  onFinish?: never;
  handleSubmit: () => Promise<void>;
  children: React.ReactNode;
}

export function TanAntForm({
  handleSubmit,
  children,
  ...antProps
}: TanAntFormProps) {
  return (
    <Form
      {...antProps}
      onFinish={() =>
        handleSubmit().catch((error: unknown) => console.error(error))
      }
    >
      {children}
    </Form>
  );
}
