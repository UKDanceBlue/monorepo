import { FontAwesome } from "@expo/vector-icons";
import { DateTime, Interval } from "luxon";
import { Heading, Icon, Row, Text } from "native-base";
import { useMemo } from "react";


/**
 * A simple row of *Event*s from *startDate* to *endDate*
 */
const EventRow = ({
  title,
  interval,
  location
}: {
  title: string;
  interval?: Interval;
  location?: string;
}) => {
  const whenString = useMemo(() => {
    let whenString = "";
    if (interval != null) {
      if (interval.start.toMillis() === DateTime.now().startOf("day").toMillis() && interval.end.toMillis() === DateTime.now().endOf("day").toMillis()) {
      // All day today
        whenString = interval.start.toFormat("All Day Today");
      } else if (interval.start.toMillis() === interval.start.startOf("day").toMillis() && interval.end.toMillis() === interval.end.endOf("day").toMillis()) {
      // All day some other day
        if (interval.start.toISODate() === interval.end.toISODate()) {
        // All day on the same day
          whenString = `All Day ${interval.start.toFormat("L/d/yyyy")}`;
        } else {
        // All day on different days
          whenString = `All Day ${ interval.toFormat("L/d/yyyy")}`;
        }
      } else if (interval.hasSame("day")) {
        whenString = `${interval.start.toFormat("L/d/yyyy h:mm a")} - ${interval.end.toFormat("h:mm a")}`;
      } else {
        whenString = interval.toFormat("L/d/yyyy h:mm a");
      }
    }
    return whenString;
  }, [interval]);

  return (
    <>
      <Heading size="md">{title}</Heading>
      <Row>
        <Icon as={<FontAwesome name="clock-o" />} size="sm" />
        <Text ml={1} fontSize="sm" fontWeight="light">
          {whenString}
        </Text>
      </Row>
      <Row>
        <Icon as={<FontAwesome name="map-marker" />} size="sm" />
        <Text ml={1} fontSize="sm" fontWeight="light">
          {location}
        </Text>
      </Row>
    </>
  );
};

export default EventRow;
