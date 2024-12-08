import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";

import { LuxonDatePicker } from "#elements/components/antLuxonComponents.js";

export function EventOccurrencePicker({ onDelete }: { onDelete?: () => void }) {
  return (
    <Flex align="center" gap="middle">
      <LuxonDatePicker.RangePicker />
      <Button onClick={onDelete} icon={<DeleteOutlined />} />
    </Flex>
  );
}
