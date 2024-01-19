import { DeleteOutlined } from "@ant-design/icons";
import { LuxonDatePicker } from "@elements/components/antLuxonComponents";
import { Button, Checkbox, Flex } from "antd";
import type { DateTime } from "luxon";
import { Interval } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";

export function EventOccurrencePicker<
  XEventOccurrenceInput extends
    | { uuid: string; interval: Interval; fullDay: boolean }
    | { interval: Interval; fullDay: boolean },
>({
  defaultOccurrence,
  onChange,
  onDelete,
}: {
  defaultOccurrence: XEventOccurrenceInput;
  onChange: (occurrence: XEventOccurrenceInput) => void;
  onDelete?: () => void;
}) {
  const [start, setStart] = useState<DateTime | null>(
    defaultOccurrence.interval.start
  );
  const [end, setEnd] = useState<DateTime | null>(
    defaultOccurrence.interval.end
  );
  const [fullDay, setFullDay] = useState<boolean>(defaultOccurrence.fullDay);

  const oldDefaultOccurrence = useRef(defaultOccurrence);
  const oldStart = useRef(start);
  const oldEnd = useRef(end);
  const oldFullDay = useRef(fullDay);

  useEffect(() => {
    if (oldDefaultOccurrence.current !== defaultOccurrence) {
      console.log(
        "defaultOccurrence changed",
        oldDefaultOccurrence.current,
        defaultOccurrence
      );
      oldDefaultOccurrence.current = defaultOccurrence;
    }
    if (oldStart.current !== start) {
      console.log("start changed", oldStart.current, start);
      oldStart.current = start;
    }
    if (oldEnd.current !== end) {
      console.log("end changed", oldEnd.current, end);
      oldEnd.current = end;
    }
    if (oldFullDay.current !== fullDay) {
      console.log("fullDay changed", oldFullDay.current, fullDay);
      oldFullDay.current = fullDay;
    }
  }, [defaultOccurrence, start, end, fullDay]);

  const uuid = useMemo(() => {
    if ("uuid" in defaultOccurrence) {
      return defaultOccurrence.uuid;
    }
    return undefined;
  }, [defaultOccurrence]);

  useEffect(() => {
    if (
      start &&
      end &&
      (!Interval.fromDateTimes(start, end).equals(defaultOccurrence.interval) ||
        fullDay !== defaultOccurrence.fullDay)
    ) {
      if (uuid) {
        onChange({
          uuid,
          interval: Interval.fromDateTimes(start, end),
          fullDay,
        } as XEventOccurrenceInput);
      } else {
        onChange({
          interval: Interval.fromDateTimes(start, end),
          fullDay,
        } as XEventOccurrenceInput);
      }
    }
  }, [
    start,
    end,
    fullDay,
    onChange,
    uuid,
    defaultOccurrence.fullDay,
    defaultOccurrence.interval,
  ]);

  useEffect(() => {
    if (fullDay) {
      if (start) {
        setStart(start.startOf("day"));
      }
      if (end) {
        setEnd(end.endOf("day"));
      }
    }
  }, [fullDay, start, end]);

  const fullDayCheckbox = (
    <Checkbox
      checked={fullDay}
      onChange={(e) => {
        setFullDay(e.target.checked);
      }}
    >
      Full day
    </Checkbox>
  );

  return (
    <Flex align="center" gap="middle">
      {fullDay ? (
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
      )}
      {fullDayCheckbox}
      <Button onClick={onDelete} icon={<DeleteOutlined />} />
    </Flex>
  );
}
