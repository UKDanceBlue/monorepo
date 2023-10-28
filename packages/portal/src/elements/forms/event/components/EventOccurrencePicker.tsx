import { LuxonDatePicker } from "@elements/components/antLuxonComponents";
import type {
  CreateEventOccurrenceInput,
  SetEventOccurrenceInput,
} from "@ukdanceblue/common/graphql-client-admin/raw-types";
import { Checkbox, Flex } from "antd";
import type { DateTime } from "luxon";
import { Interval } from "luxon";
import { useEffect, useMemo, useState } from "react";

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

  const uuid = useMemo(() => {
    if ("uuid" in defaultOccurrence) {
      return defaultOccurrence.uuid;
    }
    return undefined;
  }, [defaultOccurrence]);

  useEffect(() => {
    if (start && end) {
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
  }, [start, end, fullDay, onChange, uuid]);

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
