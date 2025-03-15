import type { Calendar } from "expo-calendar";
import { getCalendarsAsync, getDefaultCalendarAsync } from "expo-calendar";
import { Platform } from "react-native";

export async function discoverDefaultCalendar(): Promise<Calendar | null> {
  if (Platform.OS === "ios") {
    return getDefaultCalendarAsync();
  } else if (Platform.OS === "android") {
    const calendars = await getCalendarsAsync();
    return calendars.find((calendar) => calendar.isPrimary ?? false) ?? null;
  } else {
    throw new Error(`Unsupported platform: ${Platform.OS}`);
  }
}
