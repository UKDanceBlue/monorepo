import NativeBaseMarkdown from "@common/components/NativeBaseMarkdown";
import { log, universalCatch } from "@common/logging";
import { showMessage } from "@common/util/alertUtils";
import { discoverDefaultCalendar } from "@common/util/calendar";
import { useRoute } from "@react-navigation/native";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import {
  PermissionStatus,
  createEventAsync,
  getCalendarPermissionsAsync,
  requestCalendarPermissionsAsync,
} from "expo-calendar";
import { setStringAsync } from "expo-clipboard";
import { DateTime, Interval } from "luxon";
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
import {
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import openMaps from "react-native-open-maps";
import { WebView } from "react-native-webview";
import { useQuery } from "urql";

import type { RootStackScreenProps } from "../../../types/navigationTypes";

const EventScreenFragment = graphql(/* GraphQL */ `
  fragment EventScreenFragment on EventResource {
    title
    summary
    description
    location
    occurrences {
      uuid
      interval
      fullDay
    }
    images {
      imageData
      thumbHash
      url
      height
      width
      alt
      mimeType
    }
  }
`);

const eventScreenDocument = graphql(/* GraphQL */ `
  query EventScreenQuery($eventId: String!) {
    event(uuid: $eventId) {
      data {
        ...EventScreenFragment
      }
    }
  }
`);

function extractUrl(
  url: URL | string | undefined | null,
  imageData: string | undefined | null,
  mimeType: string | undefined | null
): string | undefined {
  if (url) {
    return url.toString();
  } else if (imageData && mimeType) {
    return `data:${mimeType};base64,${imageData}`;
  } else {
    return undefined;
  }
}

const EventScreen = () => {
  const {
    params: { eventId, occurrenceId },
  } = useRoute<RootStackScreenProps<"Event">["route"]>();

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [eventQuery, reloadEvent] = useQuery({
    query: eventScreenDocument,
    variables: { eventId },
  });
  const eventData = getFragmentData(
    EventScreenFragment,
    eventQuery.data?.event.data
  );

  const maxHeight = useMemo(
    () =>
      eventData?.images.reduce(
        (acc, image) =>
          Math.max(
            acc,
            Math.min(image.height, screenWidth * (image.height / image.width))
          ),
        0
      ) ?? 0,
    [eventData?.images, screenWidth]
  );

  const { colors } = useTheme();

  const occurrence = useMemo(
    () =>
      eventData?.occurrences.find(
        (occurrence) => occurrence.uuid === occurrenceId
      ) ?? eventData?.occurrences[0],
    [eventData?.occurrences, occurrenceId]
  );
  const interval = useMemo(
    () =>
      occurrence != null ? Interval.fromISO(occurrence.interval) : undefined,
    [occurrence]
  );

  let whenString = "";
  let allDay = false;
  if (interval != null) {
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

  const imageCount = eventData?.images.length ?? 0;

  return (
    <VStack h="full">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={eventQuery.fetching}
            onRefresh={reloadEvent}
          />
        }
        flex={1}
      >
        {imageCount > 0 &&
          eventData?.images != null &&
          (imageCount > 1 ? (
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
                    marginRight: index < imageCount - 1 ? 6 : 0,
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
                      uri: extractUrl(
                        pageImage.url,
                        pageImage.imageData,
                        pageImage.mimeType
                      ),
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
                  uri:
                    eventData.images[0].url?.toString() ??
                    `data:image/png;base64,${eventData.images[0].imageData}`,
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
          {eventData?.title}
        </Heading>
        {eventData?.location != null && (
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
          {whenString}
        </Text>

        <Button
          onPress={async () => {
            try {
              const permissionResponse = await getCalendarPermissionsAsync();
              let permissionStatus = permissionResponse.status;
              const { canAskAgain } = permissionResponse;

              if (permissionStatus === PermissionStatus.DENIED) {
                showMessage(
                  "Go to your device settings to enable calendar access",
                  "Calendar access denied"
                );
              } else if (
                permissionStatus === PermissionStatus.UNDETERMINED ||
                canAskAgain
              ) {
                permissionStatus =
                  // eslint-disable-next-line unicorn/no-await-expression-member
                  (await requestCalendarPermissionsAsync()).status;
              }

              if (permissionStatus === PermissionStatus.GRANTED) {
                const defaultCalendar = await discoverDefaultCalendar();
                if (defaultCalendar == null) {
                  showMessage(undefined, "No calendar found");
                } else {
                  await createEventAsync(defaultCalendar.id, {
                    title: eventData?.title,
                    allDay,
                    notes: `${eventData?.summary ?? ""}\n\n${
                      eventData?.description ?? ""
                    }`,
                    // TODO: fix these start and end dates
                    startDate: interval!.start.toJSDate(),
                    endDate: interval!.end.toJSDate(),
                    location: eventData?.location ?? undefined,
                  });
                  showMessage(undefined, "Event created");
                }
              }
            } catch (error) {
              universalCatch(error);
            }
          }}
        >
          Add to my calendar
        </Button>

        <Box mx={2}>
          <NativeBaseMarkdown>{eventData?.description}</NativeBaseMarkdown>
        </Box>

        {eventData?.location && (
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
