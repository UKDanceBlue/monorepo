import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import { DateTime } from "luxon";
import { Box, Button, HStack, Text, VStack } from "native-base";
import { ImageBackground, ImageSourcePropType, PixelRatio, Share, StatusBar, TouchableOpacity, useWindowDimensions } from "react-native";

import CountdownView from "../../../../common/components/CountdownView";
import { universalCatch } from "../../../../common/logging";
import { useReactNavigationTheme } from "../../../../theme";

import HeaderImage from "./HeaderImage";
import SponsorCarousel from "./SponsorCarousel";

/**
 * Component for home screen in main navigation
 */
const HomeScreen = () => {
  const bgColor = useReactNavigationTheme().colors.background;
  const {
    width: screenWidth, fontScale
  } = useWindowDimensions();

  return (
    <>
      <StatusBar hidden = { false } />
      <VStack flexDirection="column" bgColor={bgColor} flex={1}>
        <Box
          flex={1}
          tintColor={bgColor}
          borderBottomColor="secondary.400"
          borderBottomWidth={2}
          borderBottomStyle="solid">
          <HeaderImage />
        </Box>
        <ImageBackground
          source={require("../../../../../assets/bg-geometric/blue.png") as ImageSourcePropType}
          resizeMode="cover"
          style={{ width: screenWidth, borderBottomColor: "#FFC72C", borderBottomWidth: 3, flex: 1 }}>
          <Box height="23%">
            {/* <PodcastPlayer />*/}
            <Text
              textAlign="center"
              color="secondary.400"
              fontFamily="headingBold"
              fontSize={30/fontScale}
              shadow="1"
              style={{
                textShadowColor: "secondary.300",
                textShadowOffset: { width: 2, height: 1.5 },
                textShadowRadius: 1
              }}>{"Countdown 'til Marathon"}</Text>
            <CountdownView endTime={DateTime.fromObject({ year: 2023, month: 3, day: 25, hour: 20 }).toMillis()} />
          </Box>
        </ImageBackground>
        <Box flex={1}>
          <SponsorCarousel />
        </Box>
        <Box flex={1} justifyContent="center">
          <HStack justifyContent="center">
            <Button
              onPress={() => {
                openURL("https://danceblue.networkforgood.com").catch(universalCatch);
              }}
              width="2/5"
              backgroundColor="primary.600"
              _text={{ color: "secondary.400" }}
              _pressed={{ opacity: 0.6 }}>
            Donate #FTK!
            </Button>
            <Button
              onPress={() => {
                Share.share({ url: "https://danceblue.org/marathon-livestream" }).catch(universalCatch);
              }}
              width="2/5"
              backgroundColor={"secondary.400"}
              _text={{ color: "primary.600" }}
              _pressed={{ opacity: 0.6 }}>
              Share Zoom Link
            </Button>
            {/* <Button
              onPress={() => {
                openURL("https://danceblue.org").catch(universalCatch);
              }}
              width="2/5"
              backgroundColor={"secondary.400"}
              _text={{ color: "primary.600" }}
              _pressed={{ opacity: 0.6 }}>
              Go to DanceBlue HQ
            </Button>
            */}
          </HStack>
          <HStack justifyContent="center">
            <Button backgroundColor="transparent">
              <TouchableOpacity onPress={() => {
                openURL("https://www.facebook.com/danceblue/").catch(universalCatch);
              }}>
                <FontAwesome
                  name="facebook"
                  color="#0032A0"
                  style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
                />
              </TouchableOpacity>
            </Button>
            <Button backgroundColor="transparent">
              <TouchableOpacity onPress={() => {
                openURL("https://www.instagram.com/uk_danceblue/").catch(universalCatch);
              }}>
                <FontAwesome5
                  name="instagram"
                  color="#0032A0"
                  style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
                />
              </TouchableOpacity>
            </Button>
            <Button backgroundColor="transparent">
              <TouchableOpacity onPress={() => {
                openURL("https://www.tiktok.com/@uk_danceblue").catch(universalCatch);
              }}>
                <FontAwesome5
                  name="tiktok"
                  color="#0032A0"
                  style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
                />
              </TouchableOpacity>
            </Button>
            <Button backgroundColor="transparent">
              <TouchableOpacity onPress={() => {
                openURL("https://www.youtube.com/channel/UCcF8V41xkzYkZ0B1IOXntjg").catch(universalCatch);
              }}>
                <FontAwesome5
                  name="youtube"
                  color="#0032A0"
                  style={{ textAlignVertical: "center", fontSize: PixelRatio.get() * 8 }}
                />
              </TouchableOpacity>
            </Button>
          </HStack>
        </Box>
        {/* <Box height="8%">
          <Button                 ORIGINAL DONATE NOW BUTTON
            borderRadius={0}
            margin={0}
            backgroundColor="primary.600"
            _pressed={{ opacity: 0.5 }}
            alignContent="center"
            jutsifyContent="center"
            onPress={async () => {
              if (
                await Linking.canOpenURL(
                  "https://danceblue.networkforgood.com/"
                ).catch(universalCatch)
              ) {
                Linking.openURL(
                  "https://danceblue.networkforgood.com/"
                ).catch(universalCatch);
              }
            }}
          >
            <Text
              bold
              fontSize="xl"
              color="light.100"
              shadow="1">Donate Now!</Text>
          </Button>
          </Box>*/}
      </VStack>
    </>
  );
};

HomeScreen.navigationOptions = { title: "Home" };

export default HomeScreen;
