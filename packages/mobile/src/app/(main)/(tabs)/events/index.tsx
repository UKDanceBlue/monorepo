import { withScope } from "@sentry/react-native";
import { cleanTruncateString } from "@ukdanceblue/common";
import { Link } from "expo-router";
import { DateTime, type Duration, Interval } from "luxon";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  View,
  VirtualizedList,
} from "react-native";
import { AgendaList, CalendarProvider } from "react-native-calendars";
import { useClient } from "urql";

import { graphql, type ResultOf } from "~/api";
import { Text } from "~/components/ui/text";
import { H4 } from "~/components/ui/typography";
import { FontAwesome5 } from "~/lib/icons/FontAwesome5";
import { Logger } from "~/lib/logger/Logger";

type MonthString = `${number}-${number}`;

const EventsDocument = graphql(/* GraphQL */ `
  query Events($from: LuxonDateTime!, $to: LuxonDateTime!) {
    events(
      sendAll: true
      filters: {
        operator: AND
        children: {
          operator: AND
          filters: [
            {
              field: start
              filter: {
                singleDateFilter: {
                  comparison: GREATER_THAN_OR_EQUAL_TO
                  value: $from
                }
              }
            }
            {
              field: end
              filter: {
                singleDateFilter: {
                  comparison: LESS_THAN_OR_EQUAL_TO
                  value: $to
                }
              }
            }
          ]
        }
      }
    ) {
      data {
        id
        title
        summary
        description
        location
        occurrences {
          id
          interval {
            start
            end
          }
          fullDay
        }
      }
      total
    }
  }
`);

const WIDTH = 25;
const CENTER = WIDTH / 2 + 0.5;

function getMonthForIndex(index: number): MonthString {
  const now = DateTime.now().toObject();

  return DateTime.fromObject({
    year: now.year,
    month: now.month,
  })
    .plus({ months: index })
    .toFormat("yyyy-MM") as MonthString;
}

export default function Events() {
  const urql = useClient();
  const [events, setEvents] = useState<
    Record<
      MonthString,
      ResultOf<typeof EventsDocument>["events"] | { error: string }
    >
  >({});

  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);

  const fetchMonth = useCallback(
    (month: MonthString) => {
      if (events[month]) {
        return Promise.resolve(events[month]);
      } else {
        Logger.debug("Fetching events for month", { context: { month } });
        return withScope(async (scope) => {
          scope.setExtra("events-page-month", month);
          await urql
            .query(EventsDocument, {
              from: DateTime.fromObject({
                year: Number(month.split("-")[0]),
                month: Number(month.split("-")[1]),
              })
                .startOf("month")
                .toISO()!,
              to: DateTime.fromObject({
                year: Number(month.split("-")[0]),
                month: Number(month.split("-")[1]),
              })
                .endOf("month")
                .toISO()!,
            })
            .toPromise()
            .then((result) => {
              setEvents((events) => ({
                ...events,
                [month]: result.data?.events,
              }));
              return result.data?.events;
            })
            .catch((error) => {
              Logger.error("Failed to fetch events", { error });
              setEvents((events) => ({
                ...events,
                [month]: { error: String(error) },
              }));
              return { error: String(error) };
            });
        });
      }
    },
    [events, urql]
  );

  useEffect(() => {
    for (let i = -3; i <= 3; i++) {
      void fetchMonth(getMonthForIndex(i));
    }
  }, [fetchMonth]);

  return (
    <VirtualizedList
      initialScrollIndex={CENTER}
      getItem={(_, index) => getMonthForIndex(index - CENTER)}
      getItemCount={() => WIDTH}
      horizontal
      nestedScrollEnabled
      pagingEnabled
      keyExtractor={(item) => item}
      windowSize={WIDTH}
      initialNumToRender={3}
      extraData={events}
      maxToRenderPerBatch={1}
      showsHorizontalScrollIndicator={false}
      getItemLayout={(_, idx) => ({
        length: width,
        offset: width * idx,
        index: idx,
      })}
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      renderItem={({ item }) => {
        void fetchMonth(item);
        return (
          <ScrollView
            className="w-screen"
            style={{ height }}
            stickyHeaderIndices={[0]}
          >
            <H4 className="text-center bg-white border-b-hairline p-2">
              {DateTime.fromISO(`${item}-01`).toFormat("MMMM yyyy")}
            </H4>
            <EventPage
              month={item}
              events={
                events[item]
                  ? "error" in events[item]
                    ? null
                    : events[item]
                  : events[item]
              }
              error={
                events[item] && "error" in events[item]
                  ? events[item].error
                  : undefined
              }
            />
            <View style={{ height: 40 }} />
          </ScrollView>
        );
      }}
    />
  );
}

interface EventItemType {
  id: string;
  interval: Interval;
  duration: Duration;
  title: string;
  location: string | null;
  summary: string | null;
}

function EventPage({
  events,
  error,
  month,
}: {
  events: ResultOf<typeof EventsDocument>["events"];
  error?: string;
  month: MonthString;
}) {
  const now = DateTime.now();

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="color-red-500">{error}</Text>
      </View>
    );
  }
  if (!events) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{month}</Text>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <CalendarProvider date={`${month}-01`}>
      <AgendaList
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <FontAwesome5 name="calendar" size={48} />
            <Text>No events</Text>
          </View>
        }
        sections={events.data.reduce<
          {
            data: EventItemType[];
            title: string;
          }[]
        >((acc, event) => {
          for (const occurrence of event.occurrences) {
            const interval = Interval.fromDateTimes(
              DateTime.fromISO(occurrence.interval.start),
              DateTime.fromISO(occurrence.interval.end)
            );
            const duration = interval.toDuration();
            const day = interval.start!.toFormat("yyyy-MM-dd");

            const existing = acc.find((section) => section.title === day);
            if (existing) {
              existing.data.push({
                id: event.id,
                interval,
                duration,
                title: event.title,
                location: event.location,
                summary:
                  event.summary ??
                  (event.description
                    ? cleanTruncateString(event.description, 100)
                    : null),
              });
            } else {
              acc.push({
                title: day,
                data: [
                  {
                    id: event.id,
                    interval,
                    duration,
                    title: event.title,
                    location: event.location,
                    summary:
                      event.summary ??
                      (event.description
                        ? cleanTruncateString(event.description, 100)
                        : null),
                  },
                ],
              });
            }
          }

          return acc;
        }, [])}
        renderItem={
          ({ item }: { item: EventItemType }) => (
            <Link
              className={`p-2 border-b border-gray-200 ${now > item.interval.start! ? "color-gray-100" : ""}`}
              href={{ pathname: "/events/[event]", params: { event: item.id } }}
            >
              <View className="flex-row justify-between gap-4">
                <View>
                  <Text>{item.interval.start!.toFormat("hh:mm a")}</Text>
                  <Text>{item.interval.end!.toFormat("hh:mm a")}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold">{item.title}</Text>
                  {item.location && (
                    <View className="flex-row items-center gap-1">
                      <FontAwesome5 name="map-pin" />
                      <Text>{item.location}</Text>
                    </View>
                  )}
                  <Text>{item.summary}</Text>
                </View>
              </View>
            </Link>
          ) /*<Text>{JSON.stringify(item, null, 2)}</Text>*/
        }
      />
    </CalendarProvider>
  );
}
