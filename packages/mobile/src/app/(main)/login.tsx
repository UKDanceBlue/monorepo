import { Button } from "@rneui/base";
import { AuthSource } from "@ukdanceblue/common";
import { ImageBackground } from "expo-image";
import { useEffect, useState } from "react";
import React from "react";
import type { ImageSourcePropType } from "react-native";
import { ActivityIndicator, Dimensions, StatusBar, View } from "react-native";

import WelcomeBackOverlay from "@/assets/screens/login-modal/welcome-back-overlay.png";
import { getLoginBackground } from "@/components/background/login";
import { Text } from "@/components/core/Text";

export default function SplashLoginScreen() {
  const { allowedLoginTypes, allowedLoginTypesLoading } =
    useAllowedLoginTypes();

  const [loginLoading, trigger] = useLogin();

  const loading = allowedLoginTypesLoading || loginLoading;

  const heightOfBackground = Dimensions.get("window").height * 0.6;
  const heightOfContent = Dimensions.get("window").height * 0.4;

  // TODO: FIX INTERVAL
  const [bgImage, setBgImage] = useState(getLoginBackground());
  useEffect(() => {
    const unsub = setInterval(() => {
      setBgImage(getLoginBackground());
    }, 1000);
    return () => clearInterval(unsub);
  }, []);

  return (
    <>
      <StatusBar hidden />
      <ImageBackground source={bgImage}>
        <ImageBackground source={WelcomeBackOverlay}>
          <View
          // justifyContent="center"
          // height={heightOfContent}
          // top={heightOfBackground}
          // zIndex={100}
          // position="absolute"
          // width={Dimensions.get("window").width}
          // marginTop={15}
          >
            <View>
              <Button
                onPress={() => trigger(AuthSource.LinkBlue)}
                // width={Dimensions.get("window").width - 50}
                // backgroundColor="secondary.400"
                // _pressed={{ backgroundColor: "primary.600" }}
                // alignSelf="center"
                // margin={5}
              >
                <Text
                // color="primary.600"
                // textAlign="center"
                // fontFamily="body"
                // fontSize="xl"
                >
                  Login with Linkblue
                </Text>
              </Button>
            </View>
            <View>
              <Button
                onPress={() => trigger(AuthSource.Anonymous)}
                // width={Dimensions.get("window").width - 50}
                // backgroundColor="primary.600"
                // _pressed={{ backgroundColor: "secondary.400" }}
                // alignSelf="center"
                // margin={5}
              >
                <Text
                // color="#ffffff"
                // textAlign="center"
                // fontFamily="body"
                // fontSize="xl"
                >
                  Continue as Guest
                </Text>
              </Button>
            </View>
          </View>
          {/* {loading && (
            <Center position="absolute" width="full" height="full">
              <ActivityIndicator size="large" />
            </Center>
          )} */}
        </ImageBackground>
      </ImageBackground>
    </>
  );
}
