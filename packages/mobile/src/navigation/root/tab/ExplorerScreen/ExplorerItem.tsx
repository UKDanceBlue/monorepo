// import DBLogoCondensed from "../../../../../assets/svgs/DBLogoCondensed";
import AudioPlayer from "@common/components/AudioPlayer";
import { universalCatch } from "@common/logging";
import { showMessage } from "@common/util/alertUtils";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { openURL } from "expo-linking";
import { Box, Button, HStack, Text, View } from "native-base";
import { useState } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import WebView from "react-native-webview";

import DBRibbon from "../../../../../assets/svgs/DBRibbon";

export const ExplorerItem = ({
  resourceLink = "https://danceblue.org",
  title = "",
  showMotd = false,
  textContent = "",
  hasAudio = false,
  hasYouTubeVideo = false,
}: {
  resourceLink?: string;
  title?: string;
  showMotd?: boolean;
  textContent?: string;
  hasAudio?: boolean;
  hasYouTubeVideo?: boolean;
}) => {
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);

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

  if (hasAudio) {
    iconName = "music";
    source = "DB Podcast";
    link = "https://danceblue.org/category/podcast";

    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    }).catch(showMessage);

    const sound = new Audio.Sound();
    sound
      .loadAsync({ uri: resourceLink })
      .then(() => {
        setSound(sound);
      })
      .catch(universalCatch);
  } else if (hasYouTubeVideo) {
    iconName = "youtube";
    source = "YouTube";
    link = "https://www.youtube.com/channel/UCcF8V41xkzYkZ0B1IOXntjg";
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
            {textContent && (
              <>
                <Text
                  fontSize={blogContentFontSize}
                  textAlign="justify"
                  fontFamily=""
                >
                  {" "}
                  {textContent}{" "}
                </Text>
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
            {hasYouTubeVideo && (
              <WebView
                style={{ height: calculatedHeight }}
                source={{ uri: resourceLink }}
                allowsFullscreenVideo={true}
              />
            )}
          </View>
        </HStack>
      </View>
    );
  }
};
