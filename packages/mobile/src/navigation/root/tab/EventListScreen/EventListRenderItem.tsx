import { EventScreenFragment } from "@navigation/root/EventScreen/EventScreenFragment";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import { getFragmentData } from "@ukdanceblue/common/dist/graphql-client-public";
import { Platform } from "expo-modules-core";
import { DateTime, Interval } from "luxon";
import { Box, Column, Heading, Row } from "native-base";
import type { MutableRefObject } from "react";
import { useCallback, useMemo } from "react";
import type { ListRenderItem } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import EventRow from "./EventRow";
import { RNCAL_DATE_FORMAT } from "./constants";

export const EventListRenderItem = ({
  item: [event, occurrenceUuid],
  index,
  dayIndexesRef,
  tryToNavigate,
}: Omit<
  Parameters<
    ListRenderItem<
      [event: FragmentType<typeof EventScreenFragment>, occurrenceUuid: string]
    >
  >[0],
  "separators"
> & {
  dayIndexesRef: MutableRefObject<Partial<Record<string, number>>>;
  tryToNavigate: (
    event: FragmentType<typeof EventScreenFragment>,
    occurrenceUuid: string
  ) => void;
}) => {
  const eventData = getFragmentData(EventScreenFragment, event);

  const now = useMemo(() => DateTime.now(), []);

  const occurrence = useMemo(() => {
    const occurrence = eventData.occurrences.find(
      (occurrence) => occurrence.uuid === occurrenceUuid
    );
    if (!occurrence) {
      return undefined;
    }
    return {
      ...occurrence,
      interval: Interval.fromISO(occurrence.interval),
    };
  }, [occurrenceUuid, eventData.occurrences]);

  const eventDate = useMemo(() => {
    return occurrence?.interval.start?.toFormat(RNCAL_DATE_FORMAT);
  }, [occurrence]);

  if (eventDate != null) {
    if (!((dayIndexesRef.current[eventDate] ?? Number.NaN) < index)) {
      dayIndexesRef.current[eventDate] = index;
    }
  }

  const onPress = useCallback(() => {
    tryToNavigate(event, occurrenceUuid);
  }, [event, occurrenceUuid, tryToNavigate]);

  return useMemo(
    () => (
      <TouchableOpacity
        onPress={onPress}
        testID={`event-list-row-${index}-touchable`}
      >
        <Row mr="5" ml="2" my="2">
          <Column
            w="20%"
            padding="1%"
            alignItems="center"
            justifyContent="center"
          >
            {eventDate != null &&
              dayIndexesRef.current[eventDate] === index && (
                <Heading
                  fontSize="2xl"
                  style={{
                    fontFamily: Platform.select({
                      ios: "Georgia",
                      android: "serif",
                    }),
                  }}
                  fontWeight="bold"
                  testID={`event-list-row-${index}-date`}
                  noOfLines={2}
                  textAlign="center"
                >
                  {occurrence?.interval.start &&
                    (now.hasSame(occurrence.interval.start, "month")
                      ? occurrence.interval.start.toFormat("EEE.\nd")
                      : occurrence.interval.start.toFormat("LLL\nd"))}
                </Heading>
              )}
          </Column>
          <Box
            p="2"
            w="80%"
            borderRightRadius="lg"
            borderLeftColor="primary.600"
            borderLeftWidth="4"
            backgroundColor={
              occurrence?.interval.contains(DateTime.local())
                ? "blue.100"
                : "white"
            }
          >
            <EventRow
              key={`${eventData.uuid}:${occurrenceUuid}`}
              title={eventData.title}
              interval={occurrence?.interval}
              location={eventData.location ?? undefined}
            />
          </Box>
        </Row>
      </TouchableOpacity>
    ),
    [
      dayIndexesRef,
      eventData.location,
      eventData.title,
      eventData.uuid,
      eventDate,
      index,
      now,
      occurrence?.interval,
      occurrenceUuid,
      onPress,
    ]
  );
};
