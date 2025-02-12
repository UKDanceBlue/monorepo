import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex } from "antd";
import { DateTime } from "luxon";
import { Interval } from "luxon";

import { LuxonDatePicker } from "#elements/components/antLuxonComponents.js";

export interface EventOccurrencePickerValue {
  id?: string;
  interval: Interval;
  fullDay: boolean;
}

export function EventOccurrencePicker({
  value = {
    interval: Interval.invalid("No input"),
    fullDay: false,
  },
  onChange = () => undefined,
  onDelete,
  id,
}: {
  value?: EventOccurrencePickerValue;
  onChange?: (occurrence: EventOccurrencePickerValue) => void;
  onDelete?: () => void;
  id?: string;
}) {
  return (
    <Flex align="center" gap="middle" id={id}>
      <LuxonDatePicker.RangePicker
        value={[value.interval.start, value.interval.end]}
        onChange={(dates) => {
          let [start, end] = dates ?? [
            DateTime.invalid("No input"),
            DateTime.invalid("No input"),
          ];
          if (!start) {
            start = DateTime.invalid("No input");
          }
          if (!end) {
            end = DateTime.invalid("No input");
          }

          if (value.fullDay) {
            start = start.startOf("day");
            end = end.endOf("day");
          }

          onChange({
            ...value,
            interval: !dates
              ? Interval.invalid("No input")
              : Interval.fromDateTimes(
                  dates[0] ?? DateTime.invalid("No input"),
                  dates[1] ?? DateTime.invalid("No input")
                ),
          });
        }}
        showSecond={false}
        use12Hours
        showTime={!value.fullDay}
        format={!value.fullDay ? "YYYY-MM-DD t" : "YYYY-MM-DD"}
        style={{ minWidth: "50ch" }}
      />
      <Checkbox
        checked={value.fullDay}
        onChange={(e) => {
          onChange({
            ...value,
            interval:
              value.interval.start && value.interval.end
                ? Interval.fromDateTimes(
                    value.interval.start.startOf("day"),
                    value.interval.end.endOf("day")
                  )
                : value.interval,
            fullDay: e.target.checked,
          });
        }}
      >
        Full day
      </Checkbox>
      <Button onClick={onDelete} icon={<DeleteOutlined />} />
    </Flex>
  );
}
