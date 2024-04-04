import { universalCatch } from "@common/logging";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { openURL } from "expo-linking";
import { openBrowserAsync } from "expo-web-browser";
import { Box, Button, HStack, Text, VStack } from "native-base";
import {
  PixelRatio,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import { useReactNavigationTheme } from "../../../../theme";
import HeaderImage from "./HeaderImage";

/**
 * Component for home screen in main navigation
 */
const InfoScreen = () => {
  const bgColor = useReactNavigationTheme().colors.background;
  const { width: screenWidth, fontScale } = useWindowDimensions();

  return (
    <>
      <StatusBar hidden={false} />
      <VStack flexDirection="column" bgColor={bgColor} flex={1}>
        <Box
          flex={1}
          tintColor={bgColor}
          borderBottomColor="secondary.400"
          borderBottomWidth={2}
          borderBottomStyle="solid"
        >
          <HeaderImage />
        </Box>
        {/* Placeholder "Welcome to DanceBlue 2024, we're getting things ready for you!\nPlease check back soon!" */}
        <Box
          flex={2}
          justifyContent="center"
          alignItems="center"
          width={screenWidth}
        >
          <Text fontSize={fontScale * 40} marginX={"1/6"} textAlign="center">
            Welcome to DanceBlue Marathon 2024! We are so excited that you are
            here!
          </Text>
        </Box>
        <Box flex={1} justifyContent="center">
          <HStack justifyContent="center">
            <Button
              onPress={() => {
                openURL("https://danceblue.networkforgood.com").catch(
                  universalCatch
                );
              }}
              width="2/5"
              backgroundColor="primary.600"
              _text={{ color: "secondary.400" }}
              _pressed={{ opacity: 0.6 }}
            >
              Donate #FTK!
            </Button>
            <Button
              onPress={() => {
                openBrowserAsync("https://dancblue.org/db24-live").catch(
                  universalCatch
                );
              }}
              width="2/5"
              backgroundColor={"secondary.400"}
              _text={{ color: "primary.600" }}
              _pressed={{ opacity: 0.6 }}
            >
              Link to the Live Stream!!
            </Button>
          </HStack>
          <HStack justifyContent="center">
            <Button backgroundColor="transparent">
              <TouchableOpacity
                onPress={() => {
                  openURL("https://www.facebook.com/danceblue/").catch(
                    universalCatch
                  );
                }}
              >
                <FontAwesome
                  name="facebook"
                  color="#0032A0"
                  style={{
                    textAlignVertical: "center",
                    fontSize: PixelRatio.get() * 8,
                  }}
                />
              </TouchableOpacity>
            </Button>
            <Button backgroundColor="transparent">
              <TouchableOpacity
                onPress={() => {
                  openURL("https://www.instagram.com/uk_danceblue/").catch(
                    universalCatch
                  );
                }}
              >
                <FontAwesome5
                  name="instagram"
                  color="#0032A0"
                  style={{
                    textAlignVertical: "center",
                    fontSize: PixelRatio.get() * 8,
                  }}
                />
              </TouchableOpacity>
            </Button>
            <Button backgroundColor="transparent">
              <TouchableOpacity
                onPress={() => {
                  openURL("https://www.tiktok.com/@uk_danceblue").catch(
                    universalCatch
                  );
                }}
              >
                <FontAwesome5
                  name="tiktok"
                  color="#0032A0"
                  style={{
                    textAlignVertical: "center",
                    fontSize: PixelRatio.get() * 8,
                  }}
                />
              </TouchableOpacity>
            </Button>
            <Button backgroundColor="transparent">
              <TouchableOpacity
                onPress={() => {
                  openURL(
                    "https://www.youtube.com/channel/UCcF8V41xkzYkZ0B1IOXntjg"
                  ).catch(universalCatch);
                }}
              >
                <FontAwesome5
                  name="youtube"
                  color="#0032A0"
                  style={{
                    textAlignVertical: "center",
                    fontSize: PixelRatio.get() * 8,
                  }}
                />
              </TouchableOpacity>
            </Button>
            <Button backgroundColor="transparent">
              <TouchableOpacity
                onPress={() => {
                  openURL("https://danceblue.org").catch(universalCatch);
                }}
              >
                <FontAwesome5
                  name="globe"
                  color="#0032A0"
                  style={{
                    textAlignVertical: "center",
                    fontSize: PixelRatio.get() * 8,
                  }}
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

InfoScreen.navigationOptions = { title: "Info" };

export default InfoScreen;
