import { AuthSource } from "@ukdanceblue/common";
import { ImageBackground } from "expo-image";
import { useEffect, useState } from "react";
import React from "react";
// import type { ImageSourcePropType } from "react-native";
import {
  // ActivityIndicator,
  // Dimensions,
  StatusBar,
  Text,
  View,
} from "react-native";

import WelcomeBackOverlay from "@/assets/screens/login-modal/welcome-back-overlay.png";
import { getLoginBackground } from "@/components/background/login";
import Button from "@/components/ui/button/Button";
import { useAllowedLoginTypes } from "@/hooks/useAllowedLoginTypes";
import { useLogin } from "@/hooks/useLogin";

export default function SplashLoginScreen() {
  const { allowedLoginTypesLoading } = useAllowedLoginTypes();

  const [loginLoading, trigger] = useLogin();

  const loading = allowedLoginTypesLoading || loginLoading;

  // const heightOfBackground = Dimensions.get("window").height * 0.6;
  // const heightOfContent = Dimensions.get("window").height * 0.4;

  // TODO: FIX INTERVAL
  const [bgImage, setBgImage] = useState(getLoginBackground());
  useEffect(() => {
    const unsub = setInterval(() => {
      setBgImage(getLoginBackground());
    }, 5000);
    return () => clearInterval(unsub);
  }, []);

  return (
    <>
      <StatusBar hidden />
      <ImageBackground source={bgImage} style={{ height: "100%" }}>
        <ImageBackground source={WelcomeBackOverlay} style={{ height: "100%" }}>
          <View className="h- flex flex-col justify-end align-center">
            <Button
              loading={loading}
              onPress={() => trigger(AuthSource.LinkBlue)}
              // width={Dimensions.get("window").width - 50}
              // backgroundColor="secondary.400"
              // _pressed={{ backgroundColor: "primary.600" }}
              // alignSelf="center"
              // margin={5}
              text="Login with LinkBlue"
            />
            <Button
              loading={loading}
              onPress={() => trigger(AuthSource.Anonymous)}
              text="Continue as Guest"
              // width={Dimensions.get("window").width - 50}
              // backgroundColor="primary.600"
              // _pressed={{ backgroundColor: "secondary.400" }}
              // alignSelf="center"
              // margin={5}
            />
          </View>
        </ImageBackground>
      </ImageBackground>
    </>
  );
}
