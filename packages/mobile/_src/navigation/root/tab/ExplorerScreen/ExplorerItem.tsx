// import DBLogoCondensed from "../../../../../assets/svgs/DBLogoCondensed";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { openURL } from "expo-linking";
import { Box, Button, HStack, Text, View } from "native-base";
import { useEffect, useState } from "react";
import React from "react";
import { PixelRatio, useWindowDimensions } from "react-native";

import AudioPlayer from "@/common/components/AudioPlayer";
import ErrorBoundary from "@/common/components/ErrorBoundary";
import { universalCatch } from "@/common/logging";
import { showMessage } from "@/common/util/alertUtils";

import DBRibbon from "../../../../common/components/svgs/DBRibbon";
import { parseBlogText } from "./parseBlogText";
import { YoutubeEmbedWebView } from "./YoutubeEmbedWebView";

function cleanupTextContent(textContent: string) {
  let completedText = "";

  let state: "leadingWhiteSpace" | "normal" | "newline" | "doubleNewline" =
    "leadingWhiteSpace";
  for (const char of textContent) {
    if (state === "leadingWhiteSpace") {
      if (char === " " || char === "\n") {
        continue;
      } else {
        state = "normal";
      }
    }

    if (state === "normal") {
      if (char === "\n") {
        state = "newline";
      } else {
        completedText += char;
      }
    }

    if (state === "newline") {
      if (char === "\n") {
        state = "doubleNewline";
      } else {
        completedText += `\n${char}`;
        state = "normal";
      }
    }

    if (state === "doubleNewline") {
      if (char === "\n") {
        continue;
      } else {
        completedText += `\n\n${char}`;
        state = "normal";
      }
    }
  }

  return completedText;
}

export const ExplorerItem = ({
  resourceLink,
  title,
  showMotd = false,
  textContent,
  hasAudio = false,
  hasYouTubeVideo = false,
  image,
  blockResource,
}: {
  resourceLink?: string;
  title?: string;
  showMotd?: boolean;
  textContent?: string;
  hasAudio?: boolean;
  hasYouTubeVideo?: boolean;
  image?: {
    url: string;
    width: number;
    height: number;
    alt?: string | undefined;
    thumbHash?: string | undefined;
  };
  blockResource?: (resource: string) => void;
}) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [plainTextContent, setPlainTextContent] = useState<string>();

  const { width: windowX, fontScale } = useWindowDimensions();

  const headerFontSize = fontScale * 15;
  const blogTitleFontSize = fontScale * 16;
  const blogContentFontSize = fontScale * 14;

  let iconName: string;
  let source = "Our Imagination";
  let link = "https://danceblue.org";

  const width = 560;
  const height = 315;
  const ratio = height / width;

  const calculatedHeight = windowX * ratio;

  useEffect(() => {
    const newSound = new Audio.Sound();
    if (hasAudio && resourceLink) {
      newSound
        .loadAsync({ uri: resourceLink })
        .then(() => {
          setSound(newSound);
        })
        .catch(universalCatch);
      return () => {
        newSound.unloadAsync().catch(universalCatch);
      };
    }

    return () => undefined;
  }, [hasAudio, resourceLink]);

  useEffect(() => {
    if (textContent) {
      parseBlogText(textContent, 350)
        .then(setPlainTextContent)
        .catch(showMessage);
    }
  }, [textContent]);

  if (hasAudio) {
    iconName = "music";
    source = "DB Podcast";
    link = "https://danceblue.org/category/podcast";

    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    }).catch(showMessage);
  } else if (hasYouTubeVideo) {
    iconName = "youtube";
    source = "YouTube";
    link = "https://www.youtube.com/channel/UCcF8V41xkzYkZ0B1IOXntjg";
  } else if (image) {
    iconName = "image";
    source = "Featured Photo";
    link = "https://photos.danceblue.org";
  } else if (textContent) {
    iconName = "compass";
    source = "DB Blog";
    link = "https://danceblue.org/news";
  } else {
    iconName = "compass";
  }

  if (showMotd) {
    return (
      <View
        /* borderBottomColor="#c5c6d0" borderBottomWidth={0.5} */ marginTop={5}
      >
        {/* THIS IS THE HEADER ROW */}
        <View borderBottomColor="#c5c6d0" borderBottomWidth={0.5}>
          <HStack alignItems="center" marginLeft={2} marginY={2}>
            <DBRibbon
              svgProps={{
                width: PixelRatio.get() * 12,
                height: PixelRatio.get() * 12,
              }}
            />
            <Text
              marginLeft={2}
              fontSize={headerFontSize}
              onPress={() => {
                openURL(link).catch(universalCatch);
              }}
            >
              {source}
            </Text>
          </HStack>
        </View>

        {/* THIS IS THE CONTENT ROW */}
        <HStack margin={2}>
          <Text
            fontSize={blogContentFontSize}
            textAlign="justify"
            fontFamily=""
          >
            DanceBlue is an entirely student-run organization that fundraises
            year-round for the DanceBlue Hematology/Oncology Clinic and
            culminates in a 24-hour no sitting, no sleeping dance marathon.
          </Text>
        </HStack>
      </View>
    );
  } else {
    return (
      <View
        /* borderBottomColor="#c5c6d0" borderBottomWidth={0.5} */ marginTop={5}
      >
        <ErrorBoundary>
          <View borderBottomColor="#c5c6d0" borderBottomWidth={0.5}>
            <HStack alignItems="center" marginLeft={2} marginY={2}>
              <FontAwesome5
                name={iconName}
                size={PixelRatio.get() * 9}
                color="#0032A0"
              />
              <Text
                marginLeft={2}
                fontSize={headerFontSize}
                onPress={() => {
                  openURL(link).catch(universalCatch);
                }}
              >
                {source}
              </Text>
            </HStack>
          </View>

          <HStack margin={2}>
            <View width="100%">
              {title && (
                <Text textAlign="center" fontSize={blogTitleFontSize}>
                  {title}
                </Text>
              )}
              {image && (
                <>
                  <Image
                    source={{
                      uri: image.url,
                      width: image.width,
                      height: image.height,
                    }}
                    placeholder={{ thumbhash: image.thumbHash }}
                    alt={image.alt}
                    style={{
                      objectFit: "contain",
                      width: "100%",
                      height: calculatedHeight,
                    }}
                  />
                  <Box width="full" alignItems="flex-end">
                    <Button
                      marginTop={0.5}
                      width="1/3"
                      onPress={() => {
                        openURL("https://photos.danceblue.org").catch(
                          universalCatch
                        );
                      }}
                    >
                      See More Photos!
                    </Button>
                  </Box>
                </>
              )}
              {plainTextContent && (
                <>
                  <Text
                    fontSize={blogContentFontSize}
                    textAlign="justify"
                    fontFamily=""
                  >
                    {cleanupTextContent(plainTextContent)}
                  </Text>
                  {resourceLink && (
                    <Box width="full" alignItems="flex-end">
                      <Button
                        marginTop={0.5}
                        width="1/3"
                        onPress={() => {
                          openURL(resourceLink).catch(universalCatch);
                        }}
                      >
                        Read More!
                      </Button>
                    </Box>
                  )}
                </>
              )}
              {sound && (
                <AudioPlayer
                  sound={sound}
                  loading={!sound}
                  title=""
                  titleLink="https://danceblue.org/category/podcast/"
                />
              )}
              {hasYouTubeVideo && resourceLink && (
                <YoutubeEmbedWebView
                  style={{ height: calculatedHeight }}
                  source={{ uri: resourceLink }}
                  allowsFullscreenVideo={true}
                  onErrorEmitted={() => blockResource?.(resourceLink)}
                />
              )}
            </View>
          </HStack>
        </ErrorBoundary>
      </View>
    );
  }
};
