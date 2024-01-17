import { universalCatch } from "@common/logging";
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed-native-base";
import { openURL } from "expo-linking";
import { openBrowserAsync } from "expo-web-browser";
import { StatusBar, useWindowDimensions } from "react-native";

import { useReactNavigationTheme } from "../../../../theme";

import HeaderImage from "./HeaderImage";
import { SocialIconView, socialIcons } from "./socialIcons";

/**
 * Component for home screen in main navigation
 */
const HomeScreen = () => {
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
            Welcome to DanceBlue 2024!
          </Text>
        </Box>
        <Box flex={1} justifyContent="center">
          <HStack justifyContent="center" space="4" margin="2">
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
                openBrowserAsync(
                  "https://danceblue.org/spirit-point-form/"
                ).catch(universalCatch);
              }}
              width="2/5"
              backgroundColor={"secondary.400"}
              _text={{ color: "primary.600" }}
              _pressed={{ opacity: 0.6 }}
            >
              Submit Spirit Points
            </Button>
          </HStack>
          <HStack justifyContent="center" space="4" margin="2">
            {socialIcons.map((icon) => (
              <SocialIconView key={icon.name} color="#0032A0" {...icon} />
            ))}
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
