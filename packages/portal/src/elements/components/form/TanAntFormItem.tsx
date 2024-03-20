import type { DeepKeys, DeepValue, FormApi } from "@tanstack/react-form";
import type { FormItemProps } from "antd";
import FormItem from "antd/es/form/FormItem";

interface TanAntChildInputProps<TParentData, TData> {
  name: DeepKeys<TParentData>;
  onChange: FormApi<TParentData>["handleSubmit"];
  onBlur: () => void;
  value: TData;
}

type TanAntFormItemProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData,
> = Omit<FormItemProps<never>, "name" | "children" | "formApi" | "index"> & {
  name: TName;
  index?: never;
  formApi: FormApi<TParentData>;
  children: (
    fieldApi: TanAntChildInputProps<TParentData, TData>
  ) => React.ReactNode;
};

export function TanAntFormItem<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
>({
  formApi,
  name,
  index,
  children,
  ...antProps
}: TanAntFormItemProps<TParentData, TName, TData>) {
  return (
    <formApi.Field name={name} index={index as never}>
      {(fieldApi) => (
        <FormItem {...antProps}>
          {children({
            name: fieldApi.name,
            onChange: formApi.handleSubmit,
            onBlur: () => fieldApi.handleBlur(),
            value: fieldApi.state.value,
          })}
        </FormItem>
      )}
    </formApi.Field>
  );
}
