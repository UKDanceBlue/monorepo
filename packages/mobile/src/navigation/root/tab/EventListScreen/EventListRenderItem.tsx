import { FirestoreEvent } from "@ukdanceblue/db-app-common";
import { Platform } from "expo-modules-core";
import { DateTime, Interval } from "luxon";
import { Box, Column, Heading, Row } from "native-base";
import { MutableRefObject, useCallback, useMemo } from "react";
import { ListRenderItem } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { timestampToDateTime } from "../../../../common/util/dateTools";

import EventRow from "./EventRow";
import { RNCAL_DATE_FORMAT } from "./constants";

export const EventListRenderItem = ({
  item: thisEvent, index, dayIndexesRef, tryToNavigate,
}:
Omit<Parameters<ListRenderItem<FirestoreEvent>>[0], "separators"> &
{
  dayIndexesRef: MutableRefObject<Partial<Record<string, number>>>;
  tryToNavigate: (event: FirestoreEvent) => void;
}) => {
  const eventDate = useMemo(() => {
    if (thisEvent.interval?.start == null) {
      return undefined;
    } else {
      return timestampToDateTime(thisEvent.interval.start).toFormat(RNCAL_DATE_FORMAT);
    }
  }, [thisEvent.interval?.start]);

  if (eventDate != null) {
    if (!((dayIndexesRef.current[eventDate] ?? NaN) < index)) {
      dayIndexesRef.current[eventDate] = index;
    }
  }

  const onPress = useCallback(() => {
    tryToNavigate(thisEvent);
  }, [ thisEvent, tryToNavigate ]);

  const interval = useMemo(() => {
    if (thisEvent.interval != null) {
      return Interval.fromDateTimes(
        timestampToDateTime(thisEvent.interval.start),
        timestampToDateTime(thisEvent.interval.end)
      );
    }
    return undefined;
  }, [thisEvent.interval]);

  return useMemo(() => (
    <TouchableOpacity
      onPress={onPress}
      testID={`event-list-row-${index}-touchable`}
    >
      <Row
        mr="5"
        ml="2"
        my="2">
        <Column
          w="20%"
          padding="1%"
          alignItems="center"
          justifyContent="center">
          {eventDate != null && dayIndexesRef.current[eventDate] === index && (
            <Heading
              fontSize="2xl"
              style={{ fontFamily: Platform.select({ ios: "Georgia", android: "serif" }) }}
              fontWeight="bold"
              testID={`event-list-row-${index}-date`}
              noOfLines={2}
              textAlign="center"
            >
              {interval?.start.toFormat("EEE.\nd")}
            </Heading>
          )}
        </Column>
        <Box
          p="2"
          w="80%"
          borderRightRadius="lg"
          borderLeftColor="primary.600"
          borderLeftWidth="4"
          backgroundColor={interval?.contains(DateTime.local()) ? "blue.100" : "white"}
        >
          <EventRow
            title={thisEvent.name}
            interval={interval}
            location={thisEvent.address}
          />
        </Box>
      </Row>
    </TouchableOpacity>
  ), [
    dayIndexesRef, eventDate, index, interval, onPress, thisEvent.address, thisEvent.name
  ]);
};

