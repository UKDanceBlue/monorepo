import { Button, Center, Image, Text, View, ZStack } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ImageSourcePropType, StatusBar } from "react-native";

import { useLinkBlueLogin } from "../../../common/auth";
import { universalCatch } from "../../../common/logging";
import { showMessage } from "../../../common/util/alertUtils";
import { useAppConfig, useFirebase } from "../../../context";

import { getRandomSplashLoginBackground } from "./SplashLoginBackgrounds";

const SplashLoginScreen = () => {
  const { allowedLoginTypes } = useAppConfig();

  const {
    fbAuth, fbFunctions
  } = useFirebase();

  const [
    loading,
    trigger,
    ,
    error
  ] = useLinkBlueLogin(fbAuth, fbFunctions);

  useEffect(() => {
    if (error) {
      showMessage(error.message, "Error logging in");
    }
  }, [error]);

  const heightOfBackground = Dimensions.get("window").height * 0.6;
  const heightOfContent = Dimensions.get("window").height * 0.4;

  // TODO: FIX INTERVAL
  const [ bgImage, setbgImage ] = useState(getRandomSplashLoginBackground());
  useEffect(() => {
    const unsub = setInterval(() => {
      setbgImage(getRandomSplashLoginBackground());
    }, 1000);
    return () => clearInterval(unsub);
  }, []);

  return (
    <>
      <StatusBar hidden/>
      <ZStack>
        <Image
          source={bgImage}
          alt="Background"
          width={Dimensions.get("window").width}
          height={heightOfBackground}
          overflow="hidden"
          resizeMode="cover"/>
        <Image
          alt="Welcome Overlay"
          source={require("../../../../assets/screens/login-modal/welcome-back-overlay.png") as ImageSourcePropType}
          height={Dimensions.get("window").height}
          width={Dimensions.get("window").width}
          resizeMode="cover"
          zIndex={0}/>
        <View>
          <View
            justifyContent="center"
            height={heightOfContent}
            top={heightOfBackground}
            zIndex={100}
            position="absolute"
            width={Dimensions.get("window").width}
            marginTop={15}>
            { allowedLoginTypes.includes("ms-oath-linkblue") && (
              <View>
                <Button
                  onPress={() => trigger()}
                  width={Dimensions.get("window").width - 50}
                  backgroundColor="secondary.400"
                  _pressed={{ backgroundColor: "primary.600" }}
                  alignSelf="center"
                  margin={5}
                >
                  <Text
                    color="primary.600"
                    textAlign="center"
                    fontFamily="body"
                    fontSize="xl">Login with Linkblue</Text>
                </Button>
              </View>
            )}

            { allowedLoginTypes.includes("anonymous") && (
              <View>
                <Button
                  onPress={() => fbAuth.signInAnonymously().catch(universalCatch)}
                  width={Dimensions.get("window").width - 50}
                  backgroundColor="primary.600"
                  _pressed={{ backgroundColor: "secondary.400" }}
                  alignSelf="center"
                  margin={5}
                >
                  <Text
                    color="#ffffff"
                    textAlign="center"
                    fontFamily="body"
                    fontSize="xl">Continue as Guest</Text>
                </Button>
              </View>
            )}
          </View>
          { loading && (
            <Center position="absolute" width="full" height="full">
              <ActivityIndicator size="large" />
            </Center>
          )}
        </View>
      </ZStack>
    </>
  );
};

export default SplashLoginScreen;
