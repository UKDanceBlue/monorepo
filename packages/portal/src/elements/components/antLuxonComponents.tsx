import { Calendar, DatePicker } from "antd";
import type { PickerTimeProps } from "antd/es/date-picker/generatePicker";
import type { DateTime } from "luxon";
import luxonGenerateConfig from "rc-picker/lib/generate/luxon";
import { forwardRef } from "react";

export const LuxonDatePicker =
  DatePicker.generatePicker<DateTime>(luxonGenerateConfig);
export const CalendarWithLuxon =
  Calendar.generateCalendar<DateTime>(luxonGenerateConfig);

export interface TimePickerProps
  extends Omit<PickerTimeProps<DateTime>, "picker"> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => (
  <LuxonDatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

TimePicker.displayName = "TimePicker";

export { TimePicker };
