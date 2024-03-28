import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

import {
  dateDataToLuxonDateTime,
  luxonDateTimeToDateData,
  luxonDateTimeToDateString,
  luxonDateTimeToMonthString,
} from "./eventListUtils";

describe("luxon <-> React Native Calendars date conversion (random data)", () => {
  const fakeDate = faker.date.future();
  fakeDate.setUTCHours(0, 0, 0, 0);
  const fakeYear = String(fakeDate.getUTCFullYear()).padStart(4, "0");
  const fakeMonth = String(fakeDate.getUTCMonth() + 1).padStart(2, "0");
  const fakeDay = String(fakeDate.getUTCDate()).padStart(2, "0");
  const fakeDateString = `${fakeYear}-${fakeMonth}-${fakeDay}`;
  const fakeTimestamp = fakeDate.getTime();
  const fakeLuxonDate = DateTime.fromJSDate(fakeDate, { zone: "utc" });

  it("converts a luxon DateTime to a string in the format used by react-native-calendars", () => {
    expect(luxonDateTimeToDateString(fakeLuxonDate)).toBe(fakeDateString);
  });

  it("converts a luxon DateTime to a month string in the format used by react-native-calendars", () => {
    expect(luxonDateTimeToMonthString(fakeLuxonDate)).toBe(
      fakeDateString.split("-").slice(0, 2).join("-")
    );
  });

  it("converts a luxon DateTime to a react-native-calendars date object", () => {
    expect(luxonDateTimeToDateData(fakeLuxonDate)).toEqual({
      dateString: fakeDateString,
      day: fakeLuxonDate.day,
      month: fakeLuxonDate.month,
      year: fakeLuxonDate.year,
      timestamp: fakeTimestamp,
    });
  });

  it("converts a react-native-calendars date object to a luxon DateTime", () => {
    expect(
      dateDataToLuxonDateTime({
        dateString: fakeDateString,
        day: fakeLuxonDate.day,
        month: fakeLuxonDate.month,
        year: fakeLuxonDate.year,
        timestamp: fakeTimestamp,
      })
    ).toEqual(fakeLuxonDate);
  });

  it("is reversible with luxon input", () => {
    expect(
      dateDataToLuxonDateTime(luxonDateTimeToDateData(fakeLuxonDate))
    ).toEqual(fakeLuxonDate);
  });

  it("is reversible with react-native-calendars input", () => {
    expect(
      luxonDateTimeToDateData(
        dateDataToLuxonDateTime({
          dateString: fakeDateString,
          day: fakeLuxonDate.day,
          month: fakeLuxonDate.month,
          year: fakeLuxonDate.year,
          timestamp: fakeTimestamp,
        })
      )
    ).toEqual({
      dateString: fakeDateString,
      day: fakeLuxonDate.day,
      month: fakeLuxonDate.month,
      year: fakeLuxonDate.year,
      timestamp: fakeTimestamp,
    });
  });
});

describe("luxon <-> React Native Calendars date conversion (fixed data)", () => {
  const year = "2020";
  const month = "06";
  const day = "03";
  const dateString = `${year}-${month}-${day}`;
  const luxonDate = DateTime.fromObject(
    {
      year: Number(year),
      month: Number(month),
      day: Number(day),
    },
    { zone: "utc" }
  );
  const timestamp = luxonDate.toMillis();

  it("converts a luxon DateTime to a string in the format used by react-native-calendars", () => {
    expect(luxonDateTimeToDateString(luxonDate)).toBe(dateString);
  });

  it("converts a luxon DateTime to a month string in the format used by react-native-calendars", () => {
    expect(luxonDateTimeToMonthString(luxonDate)).toBe(
      dateString.split("-").slice(0, 2).join("-")
    );
  });

  it("converts a luxon DateTime to a react-native-calendars date object", () => {
    expect(luxonDateTimeToDateData(luxonDate)).toEqual({
      dateString,
      day: luxonDate.day,
      month: luxonDate.month,
      year: luxonDate.year,
      timestamp,
    });
  });

  it("converts a react-native-calendars date object to a luxon DateTime", () => {
    expect(
      dateDataToLuxonDateTime({
        dateString,
        day: luxonDate.day,
        month: luxonDate.month,
        year: luxonDate.year,
        timestamp,
      })
    ).toEqual(luxonDate);
  });

  it("is reversible with luxon input", () => {
    expect(dateDataToLuxonDateTime(luxonDateTimeToDateData(luxonDate))).toEqual(
      luxonDate
    );
  });

  it("is reversible with react-native-calendars input", () => {
    expect(
      luxonDateTimeToDateData(
        dateDataToLuxonDateTime({
          dateString,
          day: luxonDate.day,
          month: luxonDate.month,
          year: luxonDate.year,
          timestamp,
        })
      )
    ).toEqual({
      dateString,
      day: luxonDate.day,
      month: luxonDate.month,
      year: luxonDate.year,
      timestamp,
    });
  });
});

describe("refresh Function", () => {
  it.todo("correctly downloads events");
});
