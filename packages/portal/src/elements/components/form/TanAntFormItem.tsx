import type {
  DeepKeys,
  DeepValue,
  FieldApi,
  FormApi,
  UpdaterFn,
} from "@tanstack/react-form";
import type { FormItemProps } from "antd";
import FormItem from "antd/es/form/FormItem";

export interface TanAntChildInputProps<TData> {
  onChange: (data: TData | UpdaterFn<TData, TData>) => void;
  onBlur: () => void;
  value: TData;
  status?: "" | "error" | "warning" | undefined;
}

type TanAntFormItemProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData,
> =
  // Grab everything from the antd form item except for the ones we're going to use ourselves
  Omit<
    FormItemProps<never>,
    "name" | "children" | "formApi" | "index" | "fieldProps"
  > & {
    // Required field API stuff
    name: TName;
    index?: never;
    // Pass in the actual form API
    formApi: FormApi<TParentData>;
    // Any extra field props like validation and stuff
    fieldProps: {
      validate?: (value: TData) => string | undefined;
    };
    // Pass in the children as a render prop, this let's us avoid some repetitive stuff
    children: (fieldApi: TanAntChildInputProps<TData>) => React.ReactNode;
  };

export function TanAntFormItem<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
>({
  formApi,
  name,
  index,
  fieldProps,
  children,
  ...antProps
}: TanAntFormItemProps<TParentData, TName, TData>) {
  return (
    <formApi.Field
      name={name}
      index={index as never}
      onChange={fieldProps.validate}
    >
      {(fieldApi: FieldApi<TParentData, TName, TData>) => {
        const {
          meta: { errors },
          value,
        } = fieldApi.state;

        return (
          <FormItem
            {...antProps}
            validateStatus={errors.length > 0 ? "error" : ""}
            help={errors.length > 0 ? errors[0] : undefined}
          >
            {children({
              onChange: fieldApi.handleChange,
              onBlur: () => fieldApi.handleBlur(),
              value,
              status: errors.length > 0 ? "error" : "",
            })}
          </FormItem>
        );
      }}
    </formApi.Field>
  );
}
