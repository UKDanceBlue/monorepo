import { Button, Form, FormProps, Input, Modal, Select } from "antd";
import type { DateTime } from "luxon";
import { useRef } from "react";

import { LuxonDatePicker } from "../antLuxonComponents";

interface FormType {
  format: "csv" | "pdf" | "xlsx";
  dateRange:
    | "all"
    | "this-month"
    | "last-month"
    | "this-year"
    | "last-year"
    | "custom";
  customDateRange?: [DateTime, DateTime];
}

const defaultValues: FormType = {
  format: "csv",
  dateRange: "all",
};

export function FundraisingReportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form] = Form.useForm<FormType>();
  const dateRange = Form.useWatch("dateRange", form);

  return (
    <Modal title="Fundraising Report" open={open} onClose={onClose}>
      <Form
        form={form}
        initialValues={defaultValues}
        onFinish={(data) => console.log(data)}
      >
        <Form.Item label="Format" name="format">
          <Select>
            <Select.Option value="csv">CSV</Select.Option>
            <Select.Option value="pdf">PDF</Select.Option>
            <Select.Option value="xlsx">Excel</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Date Range" name="dateRange">
          <Select>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="this-month">This Month</Select.Option>
            <Select.Option value="last-month">Last Month</Select.Option>
            <Select.Option value="this-year">This Fiscal Year</Select.Option>
            <Select.Option value="last-year">Last Fiscal Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Custom Date Range" name="customDateRange">
          <LuxonDatePicker.RangePicker />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Generate Report
        </Button>
      </Form>
    </Modal>
  );
}
