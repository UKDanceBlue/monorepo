import { SearchOutlined } from "@ant-design/icons";
import { Form, type FormProps, type GetRef, Input, Space } from "antd";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

export function RefineSearchForm({
  searchFormProps,
}: {
  searchFormProps: FormProps;
}) {
  const form = useRef<GetRef<typeof Form>>();

  const submit = useDebouncedCallback(() => form.current?.submit(), 300);

  return (
    <Form {...searchFormProps} ref={(ref) => (form.current = ref ?? undefined)}>
      <Space.Compact>
        <Form.Item name="$search">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            onChange={() => {
              submit();
            }}
          />
        </Form.Item>
      </Space.Compact>
    </Form>
  );
}
