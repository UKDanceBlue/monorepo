import { Calendar, getCalendarsAsync, getDefaultCalendarAsync } from "expo-calendar";
import { Platform } from "react-native";

export async function discoverDefaultCalendar(): Promise<Calendar | null> {
  if (Platform.OS === "ios") {
    return getDefaultCalendarAsync();
  } else {
    const calendars = await getCalendarsAsync();
    for (let i = 0; i < calendars.length; i++) {
      if (Platform.OS === "android" && calendars[i].isPrimary) {
        return calendars[i];
      }
    }
    if (calendars.length > 0) {
      return calendars[0];
    }
  }

  return null;
}
