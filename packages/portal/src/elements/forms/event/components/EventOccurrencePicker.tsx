import { LuxonDatePicker } from "@elements/components/antLuxonComponents";
import type {
  CreateEventOccurrenceInput,
  SetEventOccurrenceInput,
} from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { Checkbox, Flex } from "antd";
import type { DateTime } from "luxon";
import { Interval } from "luxon";
import { useEffect, useMemo, useRef, useState } from "react";

export function EventOccurrencePicker<
  XEventOccurrenceInput extends
    | SetEventOccurrenceInput
    | CreateEventOccurrenceInput,
>({
  defaultOccurrence,
  onChange,
}: {
  defaultOccurrence: XEventOccurrenceInput;
  onChange: (occurrence: XEventOccurrenceInput) => void;
}) {
  const defaultInterval = Interval.fromISO(defaultOccurrence.occurrence);
  const [start, setStart] = useState<DateTime | null>(defaultInterval.start);
  const [end, setEnd] = useState<DateTime | null>(defaultInterval.end);
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
      (!Interval.fromDateTimes(start, end).equals(defaultInterval) ||
        fullDay !== defaultOccurrence.fullDay)
    ) {
      if (uuid) {
        onChange({
          uuid,
          occurrence: Interval.fromDateTimes(start, end).toISO(),
          fullDay,
        } as XEventOccurrenceInput);
      } else {
        onChange({
          occurrence: Interval.fromDateTimes(start, end).toISO(),
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
    defaultInterval,
    defaultOccurrence.fullDay,
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
    </Flex>
  );
}
