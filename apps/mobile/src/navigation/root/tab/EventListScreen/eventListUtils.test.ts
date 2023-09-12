import { faker } from "@faker-js/faker";
import firestore from "@react-native-firebase/firestore";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { DateTime } from "luxon";

import { dateDataToLuxonDateTime, luxonDateTimeToDateData, luxonDateTimeToDateString, luxonDateTimeToMonthString, markEvents, splitEvents } from "./eventListUtils";

describe("Luxon <-> React Native Calendars date conversion (random data)", () => {
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
    expect(luxonDateTimeToMonthString(fakeLuxonDate)).toBe(fakeDateString.split("-").slice(0, 2).join("-"));
  });

  it("converts a luxon DateTime to a react-native-calendars date object", () => {
    expect(luxonDateTimeToDateData(fakeLuxonDate)).toEqual({
      dateString: fakeDateString,
      day: fakeLuxonDate.day,
      month: fakeLuxonDate.month,
      year: fakeLuxonDate.year,
      timestamp: fakeTimestamp
    });
  });

  it("converts a react-native-calendars date object to a luxon DateTime", () => {
    expect(dateDataToLuxonDateTime({
      dateString: fakeDateString,
      day: fakeLuxonDate.day,
      month: fakeLuxonDate.month,
      year: fakeLuxonDate.year,
      timestamp: fakeTimestamp
    })).toEqual(fakeLuxonDate);
  });

  it("is reversible with luxon input", () => {
    expect(dateDataToLuxonDateTime(luxonDateTimeToDateData(fakeLuxonDate))).toEqual(fakeLuxonDate);
  });

  it("is reversible with react-native-calendars input", () => {
    expect(luxonDateTimeToDateData(dateDataToLuxonDateTime({
      dateString: fakeDateString,
      day: fakeLuxonDate.day,
      month: fakeLuxonDate.month,
      year: fakeLuxonDate.year,
      timestamp: fakeTimestamp
    }))).toEqual({
      dateString: fakeDateString,
      day: fakeLuxonDate.day,
      month: fakeLuxonDate.month,
      year: fakeLuxonDate.year,
      timestamp: fakeTimestamp
    });
  });
});

describe("Luxon <-> React Native Calendars date conversion (fixed data)", () => {
  const year = "2020";
  const month = "06";
  const day = "03";
  const dateString = `${year}-${month}-${day}`;
  const luxonDate = DateTime.fromObject({
    year: Number(year),
    month: Number(month),
    day: Number(day)
  }, { zone: "utc" });
  const timestamp = luxonDate.toMillis();

  it("converts a luxon DateTime to a string in the format used by react-native-calendars", () => {
    expect(luxonDateTimeToDateString(luxonDate)).toBe(dateString);
  });

  it("converts a luxon DateTime to a month string in the format used by react-native-calendars", () => {
    expect(luxonDateTimeToMonthString(luxonDate)).toBe(dateString.split("-").slice(0, 2).join("-"));
  });

  it("converts a luxon DateTime to a react-native-calendars date object", () => {
    expect(luxonDateTimeToDateData(luxonDate)).toEqual({
      dateString,
      day: luxonDate.day,
      month: luxonDate.month,
      year: luxonDate.year,
      timestamp
    });
  });

  it("converts a react-native-calendars date object to a luxon DateTime", () => {
    expect(dateDataToLuxonDateTime({
      dateString,
      day: luxonDate.day,
      month: luxonDate.month,
      year: luxonDate.year,
      timestamp
    })).toEqual(luxonDate);
  });

  it("is reversible with luxon input", () => {
    expect(dateDataToLuxonDateTime(luxonDateTimeToDateData(luxonDate))).toEqual(luxonDate);
  });

  it("is reversible with react-native-calendars input", () => {
    expect(luxonDateTimeToDateData(dateDataToLuxonDateTime({
      dateString,
      day: luxonDate.day,
      month: luxonDate.month,
      year: luxonDate.year,
      timestamp
    }))).toEqual({
      dateString,
      day: luxonDate.day,
      month: luxonDate.month,
      year: luxonDate.year,
      timestamp
    });
  });
});

describe("Refresh Function", () => {
  it.todo("Correctly downloads events");
});

describe("splitEvents", () => {
  const fakeEvents: FirestoreEvent[] = [];
  const fakeMonthStrings: string[] = [];

  // Use faker to generate between 10 and 20 events
  const numEvents = faker.datatype.number({ min: 10, max: 20 });
  for (let i = 0; i < numEvents; i++) {
    const name = faker.random.words();
    const shortDescription = faker.random.words();
    const longDescription = faker.random.words();

    // Only every fourth event will have no date
    const shouldHaveDate = i % 4 !== 0;
    const startDate = faker.date.soon();
    fakeMonthStrings.push(luxonDateTimeToMonthString(DateTime.fromJSDate(startDate)));
    const endDate = faker.date.soon(2, startDate);

    fakeEvents.push(new FirestoreEvent(
      name,
      shortDescription,
      longDescription,
      shouldHaveDate ? {
        start: firestore.Timestamp.fromDate(startDate),
        end: firestore.Timestamp.fromDate(endDate)
      } : undefined
    ));
  }

  it("Only generates keys that there was a startTime for", () => {
    const keys = Object.keys(splitEvents(fakeEvents));

    for (const key of keys) {
      expect(fakeMonthStrings).toContain(key);
    }
  });

  it("Includes no events that don't have a date", () => {
    const events = Object.values(splitEvents(fakeEvents));

    for (const event of events) {
      for (const e of event ?? []) {
        expect(e.interval).toBeDefined();
      }
    }
  });

  it("Outputs the correct month string for each event", () => {
    const events = Object.entries(splitEvents(fakeEvents));

    for (const [ monthString, event ] of events) {
      for (const e of event ?? []) {
        expect(e.interval).toBeDefined();
        expect(luxonDateTimeToMonthString(DateTime.fromJSDate(e.interval!.start.toDate()))).toBe(monthString);
      }
    }
  });
});

describe("markEvents", () => {
  const fakeEvents: FirestoreEvent[] = [];
  const fakeMonthStrings: string[] = [];

  // Use faker to generate between 10 and 20 events
  const numEvents = faker.datatype.number({ min: 10, max: 20 });
  for (let i = 0; i < numEvents; i++) {
    const name = faker.random.words();
    const shortDescription = faker.random.words();
    const longDescription = faker.random.words();
    const startDate = faker.date.soon();
    fakeMonthStrings.push(luxonDateTimeToDateString(DateTime.fromJSDate(startDate)));
    const endDate = faker.date.soon(2, startDate);

    fakeEvents.push(new FirestoreEvent(
      name,
      shortDescription,
      longDescription,
      {
        start: firestore.Timestamp.fromDate(startDate),
        end: firestore.Timestamp.fromDate(endDate)
      }
    ));
  }

  // Randomly choose a fakeStartTimes to be today
  const todyIndex = faker.datatype.number({ min: 0, max: fakeMonthStrings.length - 1 });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const oldDateTimeLocal = DateTime.local;
  DateTime.local = jest.fn(() => DateTime.fromJSDate(fakeEvents[todyIndex].interval!.start.toDate()));

  // Used for most tests
  const markedDates = markEvents(fakeEvents);

  DateTime.local = oldDateTimeLocal;

  it("Marks the correct dates as having events", () => {
    for (const key of Object.keys(markedDates)) {
      expect(fakeMonthStrings).toContain(key);
    }
  });

  it("Marks today when there are events today", () => {
    expect(markedDates[fakeMonthStrings[todyIndex]]).toBeDefined();
    expect(markedDates[fakeMonthStrings[todyIndex]].today).toBe(true);
  });

  it("Only marks a single date as today", () => {
    const todayDates = Object.values(markedDates).filter((date) => date.today);
    expect(todayDates).toHaveLength(1);
  });
});
