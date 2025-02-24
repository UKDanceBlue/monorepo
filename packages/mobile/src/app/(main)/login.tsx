import { AuthSource } from "@ukdanceblue/common";
import { ImageBackground } from "expo-image";
import { Redirect, useLocalSearchParams } from "expo-router";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useEffect, useState } from "react";
import React from "react";
import { StatusBar, View } from "react-native";

import WelcomeBackOverlay from "~/assets/screens/login-modal/welcome-back-overlay.png";
import { useAuthContext } from "~/components/auth/AuthContext";
import { getLoginBackground } from "~/components/background/login";
import { Button } from "~/components/ui/button";
import { useAllowedLoginTypes } from "~/hooks/useAllowedLoginTypes";
import { useLogin } from "~/hooks/useLogin";

export default function SplashLoginScreen() {
  const { token: existingToken, setToken } = useAuthContext();
  const loggedIn = existingToken != null;

  const { allowedLoginTypesLoading } = useAllowedLoginTypes();

  const [loginLoading, trigger] = useLogin();

  const loading = allowedLoginTypesLoading || loginLoading;

  const [bgImage, setBgImage] = useState(getLoginBackground());
  useEffect(() => {
    const unsub = setInterval(() => {
      setBgImage(getLoginBackground());
    }, 5000);
    return () => clearInterval(unsub);
  }, []);

  const { token } = useLocalSearchParams<{
    token?: string;
  }>();

  useEffect(() => {
    if (token) {
      maybeCompleteAuthSession();
    }
    setToken(token ?? null);
  }, [token, setToken]);

  if (loggedIn) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return (
    <>
      <StatusBar hidden />
      <ImageBackground source={bgImage} style={{ height: "100%" }}>
        <ImageBackground
          source={WelcomeBackOverlay}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <View className="flex flex-col align-bottom align-center gap-4 p-8">
            <Button
              loading={loading}
              onPress={() => trigger(AuthSource.LinkBlue)}
            >
              Login with LinkBlue
            </Button>
            <Button
              loading={loading}
              onPress={() => trigger(AuthSource.Anonymous)}
            >
              Continue as Guest
            </Button>
          </View>
        </ImageBackground>
      </ImageBackground>
    </>
  );
}
