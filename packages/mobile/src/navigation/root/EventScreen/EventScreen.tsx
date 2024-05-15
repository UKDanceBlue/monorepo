import NativeBaseMarkdown from "@common/components/NativeBaseMarkdown";
import { log } from "@common/logging";
import { showMessage } from "@common/util/alertUtils";
import { useRoute } from "@react-navigation/native";
import { intervalFromSomething } from "@ukdanceblue/common";
import { getFragmentData } from "@ukdanceblue/common/dist/graphql-client-public";
import { setStringAsync } from "expo-clipboard";
import type { Interval } from "luxon";
import { DateTime } from "luxon";
import {
  Badge,
  Box,
  Button,
  Center,
  Heading,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
  ZStack,
  useTheme,
} from "native-base";
import { useMemo } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import openMaps from "react-native-open-maps";
import { WebView } from "react-native-webview";

import type { RootStackScreenProps } from "../../../types/navigationTypes";

import { EventScreenFragment } from "./EventScreenFragment";
import { onAddToCalendar } from "./addToCalendar";

const EventScreen = () => {
  const {
    params: { event, occurrenceId },
  } = useRoute<RootStackScreenProps<"Event">["route"]>();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const eventData = getFragmentData(EventScreenFragment, event);

  const maxHeight = useMemo(
    () =>
      eventData.images.reduce(
        (acc, image) =>
          Math.max(
            acc,
            Math.min(image.height, screenWidth * (image.height / image.width))
          ),
        0
      ),
    [eventData.images, screenWidth]
  );

  const { colors } = useTheme();

  return (
    <VStack h="full">
      <ScrollView flex={1}>
        {eventData.images.length > 0 &&
          (eventData.images.length > 1 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={true}
              horizontal
              style={{ height: maxHeight }}
            >
              {eventData.images.map((pageImage, index) => (
                <ZStack
                  key={index}
                  style={{
                    width: Math.min(pageImage.width, screenWidth),
                    height: Math.min(
                      pageImage.height,
                      screenWidth * (pageImage.height / pageImage.width)
                    ),
                    marginRight: index < eventData.images.length - 1 ? 6 : 0,
                  }}
                >
                  {eventData.images.length > 1 && (
                    <Badge
                      position="relative"
                      rounded="full"
                      bottom={2}
                      right={2}
                      zIndex={1}
                      variant="solid"
                    >
                      <Text color="white">
                        {index + 1}/{eventData.images.length}
                      </Text>
                    </Badge>
                  )}
                  <Image
                    source={{
                      uri: pageImage.url?.toString(),
                      width: pageImage.width,
                      height: pageImage.height,
                    }}
                    alt={pageImage.alt ?? ""}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                </ZStack>
              ))}
            </ScrollView>
          ) : (
            !!eventData.images[0] && (
              <Image
                source={{
                  uri: eventData.images[0].url?.toString(),
                  width: eventData.images[0].width,
                  height: eventData.images[0].height,
                }}
                alt={
                  eventData.images[0].alt ??
                  eventData.images[0].url?.toString() ??
                  ""
                }
                style={{
                  width: "100%",
                  height: Math.min(
                    eventData.images[0].height,
                    screenWidth *
                      (eventData.images[0].height / eventData.images[0].width)
                  ),
                }}
                resizeMode="contain"
              />
            )
          ))}
        <Heading my={1} mx={2} textAlign="center">
          {eventData.title}
        </Heading>
        {eventData.location != null && (
          <Pressable
            onPress={() => {
              setStringAsync(eventData.location ?? "")
                .then(() => {
                  showMessage(undefined, "Address copied to clipboard");
                })
                .catch(showMessage);
            }}
            _pressed={{ opacity: 0.6 }}
          >
            <Text mx={2} textAlign="center" color="darkBlue.700">
              {eventData.location}
            </Text>
          </Pressable>
        )}
        <Text textAlign="center" mx={2} mb={2}>
          {eventData.occurrences.map((occurrence) => {
            const highlighted = occurrence.uuid === occurrenceId;

            const interval = intervalFromSomething(occurrence.interval);
            const { whenString, allDay } = stringifyInterval(interval);

            return (
              <Text
                key={occurrence.uuid}
                color={highlighted ? "darkBlue.700" : "darkBlue.500"}
                fontWeight={highlighted ? "bold" : "normal"}
              >
                {whenString}
                {allDay && " (All Day)"}
                {"\n"}
              </Text>
            );
          })}
        </Text>

        <Button onPress={() => onAddToCalendar(event, occurrenceId)}>
          Add to my calendar
        </Button>

        <Box mx={2}>
          <NativeBaseMarkdown>{eventData.description}</NativeBaseMarkdown>
        </Box>

        {eventData.location && (
          <Box height={screenHeight * 0.4} p={3}>
            <Pressable
              _pressed={{ opacity: 0.5 }}
              onPress={(e) => {
                e.preventDefault();
                e.stopPropagation();
                log(`Opening ${eventData.location} in os-default maps app`);
                openMaps({
                  query: eventData.location ?? undefined,
                  mapType: "standard",
                });
              }}
              width="100%"
              height="100%"
            >
              <WebView
                style={{ width: "100%", height: "100%" }}
                scrollEnabled={false}
                focusable={false}
                pointerEvents="none"
                containerStyle={{
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: colors.secondary[800],
                }}
                renderLoading={() => (
                  <Center width="full" height="full">
                    <ActivityIndicator size="large" />
                  </Center>
                )}
                startInLoadingState
                source={{
                  html: `<iframe
                      width="100%"
                      height="98%"
                      frameborder="0" style="border:0"
                      referrerpolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDGsPvQP-A9jgYnY5yxl3J9hRYJelsle9w&q=${eventData.location}&zoom=17&region=us"
                      >
                    </iframe>`,
                }}
              />
            </Pressable>
          </Box>
        )}
      </ScrollView>
    </VStack>
  );
};

export default EventScreen;
function stringifyInterval(
  interval: Interval<true> | Interval<false> | undefined
) {
  let whenString = "";
  let allDay = false;
  if (interval != null && interval.isValid) {
    if (
      interval.start.toMillis() === DateTime.now().startOf("day").toMillis() &&
      interval.end.toMillis() === DateTime.now().endOf("day").toMillis()
    ) {
      // All day today
      whenString = interval.start.toFormat("All Day Today");
      allDay = true;
    } else if (
      interval.start.toMillis() === interval.start.startOf("day").toMillis() &&
      interval.end.toMillis() === interval.end.endOf("day").toMillis()
    ) {
      // All day some other day
      if (interval.start.toISODate() === interval.end.toISODate()) {
        // All day on the same day
        whenString = `All Day ${interval.start.toFormat("L/d/yyyy")}`;
        allDay = true;
      } else {
        // All day on different days
        whenString = interval.start.toFormat(
          `All Day ${interval.start.toFormat(
            "L/d/yyyy"
          )} - ${interval.end.toFormat("L/d/yyyy")}`
        );
        allDay = true;
      }
    } else if (interval.hasSame("day")) {
      whenString = `${interval.start.toFormat(
        "L/d/yyyy h:mm a"
      )} - ${interval.end.toFormat("h:mm a")}`;
    } else {
      whenString = interval.toFormat("L/d/yyyy h:mm a");
    }
  }
  return { whenString, allDay };
}
