import { useRoute } from "@react-navigation/native";
import { DownloadableImage } from "@ukdanceblue/db-app-common";
import { PermissionStatus,
  createEventAsync,
  getCalendarPermissionsAsync,
  requestCalendarPermissionsAsync } from "expo-calendar";
import { setStringAsync } from "expo-clipboard";
import { openBrowserAsync } from "expo-web-browser";
import { DateTime } from "luxon";
import { Badge,
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
  useTheme } from "native-base";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, useWindowDimensions } from "react-native";
import openMaps from "react-native-open-maps";
import { WebView } from "react-native-webview";

import NativeBaseMarkdown from "../../../common/components/NativeBaseMarkdown";
import { firestoreIntervalToLuxon } from "../../../common/firestoreUtils";
import { log, universalCatch } from "../../../common/logging";
import { showMessage } from "../../../common/util/alertUtils";
import { discoverDefaultCalendar } from "../../../common/util/calendar";
import { useFirebase } from "../../../context";
import { RootStackScreenProps } from "../../../types/navigationTypes";

const EventScreen = () => {
  const {
    params: {
      event: {
        name, description, address, images: firestoreImages, interval: firestoreInterval, highlightedLinks
      }
    }
  } = useRoute<RootStackScreenProps<"Event">["route"]>();

  const {
    width: screenWidth, height: screenHeight
  } = useWindowDimensions();

  const totalWidth = useMemo(() => (firestoreImages?.reduce((acc, image) => acc + image.width, 0) ?? 0), [firestoreImages]);
  const maxHeight = useMemo(() => (firestoreImages?.reduce((acc, image) => Math.max(acc, Math.min(
    image.height,
    (screenWidth * (image.height / image.width))
  )), 0) ?? 0), [ firestoreImages, screenWidth ]);
  const [ images, setImages ] = useState<(DownloadableImage | null)[] | undefined>(firestoreImages == null ? undefined : Array(firestoreImages.length).fill(null));

  const { colors } = useTheme();
  const { fbStorage } = useFirebase();

  useEffect(() => {
    if (firestoreImages == null) {
      return;
    } else {
      Promise.all(firestoreImages.map((image) => {
        return DownloadableImage.fromFirestoreImage(
          image,
          (uri: string) => {
            if (uri.startsWith("gs://")) {
              return fbStorage.refFromURL(uri).getDownloadURL();
            } else {
              return Promise.resolve(uri);
            }
          }
        );
      })).then(setImages).catch(universalCatch);
    }
  }, [ fbStorage, firestoreImages ]);

  const interval = firestoreInterval ? firestoreIntervalToLuxon(firestoreInterval) : undefined;

  let whenString = "";
  let allDay = false;
  if (interval != null) {
    if (interval.start.toMillis() === DateTime.now().startOf("day").toMillis() && interval.end.toMillis() === DateTime.now().endOf("day").toMillis()) {
      // All day today
      whenString = interval.start.toFormat("All Day Today");
      allDay = true;
    } else if (interval.start.toMillis() === interval.start.startOf("day").toMillis() && interval.end.toMillis() === interval.end.endOf("day").toMillis()) {
      // All day some other day
      if (interval.start.toISODate() === interval.end.toISODate()) {
        // All day on the same day
        whenString = `All Day ${interval.start.toFormat("L/d/yyyy")}`;
        allDay = true;
      } else {
        // All day on different days
        whenString = interval.start.toFormat(`All Day ${interval.start.toFormat("L/d/yyyy")} - ${interval.end.toFormat("L/d/yyyy")}`);
        allDay = true;
      }
    } else if (interval.hasSame("day")) {
      whenString = `${interval.start.toFormat("L/d/yyyy h:mm a")} - ${interval.end.toFormat("h:mm a")}`;
    } else {
      whenString = interval.toFormat("L/d/yyyy h:mm a");
    }
  }

  const imageCount = images?.length ?? 0;

  return (
    <VStack h="full">
      <ScrollView>
        {
          (imageCount) > 0 && images != null && (
            imageCount > 1
              ? (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={true}
                  horizontal
                  style={{ height: maxHeight }}>
                  {images.map((pageImage, index) => (
                    pageImage ? (
                      <ZStack key={index} style={{ width: Math.min(pageImage.width, screenWidth), height: Math.min(pageImage.height, (screenWidth * (pageImage.height / pageImage.width))), marginRight: index < imageCount - 1 ? 6 : 0 }}>
                        {images.length > 1 &&
                      <Badge
                        position="relative"
                        rounded="full"
                        bottom={2}
                        right={2}
                        zIndex={1}
                        variant="solid">
                        <Text color="white">{index+1}/{images.length}</Text>
                      </Badge>}
                        <Image
                          source={{ uri: pageImage.url, width: pageImage.width, height: pageImage.height }}
                          alt={name}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="contain"
                        />
                      </ZStack>
                    ) : (
                      <Center key={index} style={{ width: Math.min(screenWidth, totalWidth), height: maxHeight, marginRight: index < imageCount - 1 ? 6 : 0 }}>
                        <ActivityIndicator color={colors.primary[500]} />
                      </Center>
                    )))}
                </ScrollView>)
              : (
                !!(images[0]) && (
                  <Image
                    source={{ uri: images[0].url, width: images[0].width, height: images[0].height }}
                    alt={name}
                    style={{ width: "100%", height: Math.min(images[0].height, (screenWidth * (images[0].height / images[0].width))) }}
                    resizeMode="contain"
                  />
                )
              )
          )
        }
        <Heading my={1} mx={2} textAlign="center">{name}</Heading>
        {address != null &&
          (<Pressable
            onPress={() => {
              setStringAsync(address).then(() => {
                showMessage(undefined, "Address copied to clipboard");
              }).catch(showMessage);
            }}
            _pressed={{ opacity: 0.6 }}
          >
            <Text
              mx={2}
              textAlign="center"
              color="darkBlue.700"
            >
              {address}
            </Text>
          </Pressable>)
        }
        <Text textAlign="center" mx={2} mb={2}>{whenString}</Text>

        <Button onPress={async () => {
          try {
            const permissionResponse = (await getCalendarPermissionsAsync());
            let permissionStatus = permissionResponse.status;
            const { canAskAgain } = permissionResponse;

            if (permissionStatus === PermissionStatus.DENIED) {
              showMessage("Go to your device settings to enable calendar access", "Calendar access denied");
            } else if (permissionStatus === PermissionStatus.UNDETERMINED || canAskAgain) {
              permissionStatus = (await requestCalendarPermissionsAsync()).status;
            }

            if (permissionStatus === PermissionStatus.GRANTED) {
              const defaultCalendar = await discoverDefaultCalendar();
              if (defaultCalendar == null) {
                showMessage(undefined, "No calendar found");
              } else {
                await createEventAsync(defaultCalendar.id, {
                  title: name,
                  allDay,
                  notes: description,
                  startDate: interval?.start.toJSDate(),
                  endDate: interval?.end.toJSDate(),
                  location: address
                });
                showMessage(undefined, "Event created");
              }
            }
          } catch (error) {
            universalCatch(error);
          }
        }
        }>
          Add to my calendar
        </Button>

        <Box mx={2}>
          <NativeBaseMarkdown>
            {description}
          </NativeBaseMarkdown>
        </Box>
        {/* Maybe consider removing the link option in favor of just using markdown links? Or keep it so centered links are a thing?? */}
        {highlightedLinks && (
          <>
            {highlightedLinks.map((pageLink, index) => (
              <Pressable
                _pressed={{ opacity: 0.6 }}
                width="full"
                mx={2}
                mb={2}
                onPress={() => openBrowserAsync(pageLink.url).catch(universalCatch)}
                key={index}
              >
                <Text
                  textAlign="center"
                  color="blue.600"
                  underline>
                  {pageLink.text}
                </Text>
              </Pressable>
            ))}
          </>
        )}

        {address &&
          <Box
            height={screenHeight * .4}
            p={3}
          >
            <Pressable
              _pressed={{ opacity: 0.5 }}
              onPress={(e) => {
                e.preventDefault();
                e.stopPropagation();
                log(`Opening ${address} in os-default maps app`);
                openMaps({
                  query: address,
                  mapType: "standard"
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
                containerStyle={{ borderRadius: 5, borderWidth: 2, borderColor: colors.secondary[800] }}
                renderLoading={() => <Center width="full" height="full"><ActivityIndicator size="large" /></Center>}
                startInLoadingState
                source={{
                  html: `<iframe
                      width="100%"
                      height="98%"
                      frameborder="0" style="border:0"
                      referrerpolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDGsPvQP-A9jgYnY5yxl3J9hRYJelsle9w&q=${address}&zoom=17&region=us"
                      >
                    </iframe>`
                }} />
            </Pressable>
          </Box>
        }
      </ScrollView>
    </VStack>
  );
};

export default EventScreen;
