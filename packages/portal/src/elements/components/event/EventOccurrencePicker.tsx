import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex } from "antd";
import { DateTime } from "luxon";
import { Interval } from "luxon";

import { LuxonDatePicker } from "#elements/components/antLuxonComponents.js";

export function EventOccurrencePicker({
  value = {
    interval: Interval.invalid("No input"),
    fullDay: false,
  },
  onChange = () => undefined,
  onDelete,
  id,
}: {
  value?: { id?: string; interval: Interval; fullDay: boolean };
  onChange?: (occurrence: {
    id?: string;
    interval: Interval;
    fullDay: boolean;
  }) => void;
  onDelete?: () => void;
  id?: string;
}) {
  return (
    <Flex align="center" gap="middle" id={id}>
      {/* {fullDay ? (
        <LuxonDatePicker.RangePicker
          value={[start, end]}
          onChange={(dates) => {
            setStart(dates?.[0] ?? null);
            setEnd(dates?.[1] ?? null);
          }}
        />
      ) : (
        <LuxonDatePicker.RangePicker
          value={[start, end]}
          onChange={(dates) => {
            setStart(dates?.[0] ?? null);
            setEnd(dates?.[1] ?? null);
          }}
          showTime
          format="YYYY-MM-DD HH:mm"
        />
      )} */}
      <LuxonDatePicker.RangePicker
        value={[value.interval.start, value.interval.end]}
        onChange={(dates) => {
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
