import dbWordLogo from "@assets/logo/big-words.png";
import { Logger } from "@common/logger/Logger";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Camera, FlashMode } from "expo-camera";
import { Box, Button, Fab, Icon, Image, Text, View } from "native-base";
// import { useWindowDimensions } from "react-native";

import { PreviewMoment } from "./PreviewMoment";
import { useCameraState } from "./useCameraState";

export const DBMomentsScreen = () => {
  // const { height: screenHeight } = useWindowDimensions();

  // relative heights based on jackson's iphone aspect ratio
  // const headerBias = (98 / 932) * screenHeight;
  // const invHeaderBias = screenHeight - headerBias;
  // const navBias = ((932 - 94) / 932) * screenHeight; // will not need once nav is changed
  // const invNavBias = screenHeight - navBias; // will not need once nav is changed

  const {
    cameraRef,
    facing,
    flash,
    images,
    onCameraReady,
    state,
    toggleFacing,
    toggleFlash,
    requestPermission,
    startTakingPictures,
    reset,
    takingPicture,
  } = useCameraState();

  switch (state) {
    case "permission-blocked": {
      return (
        <View alignItems={"center"} height="100%" justifyContent={"center"}>
          <Image source={dbWordLogo} alt="DB Word Logo" size="2xl" />
          <Text fontSize="md" marginTop={5}>
            Camera permissions are disabled. Please enable them in your
            settings.
          </Text>
        </View>
      );
    }
    case "permission-ask": {
      return (
        <View alignItems={"center"} height="100%" justifyContent={"center"}>
          <Image source={dbWordLogo} alt="DB Word Logo" size="2xl" />
          <Text fontSize="md" marginTop={5}>
            Please give DanceBlue permission to use your camera!
          </Text>
          <Button
            onPress={requestPermission}
            width="2/5"
            backgroundColor="primary.600"
            _text={{ color: "secondary.400" }}
            _pressed={{ opacity: 0.6 }}
          >
            Allow Access
          </Button>
        </View>
      );
    }
    case "loading": {
      // TODO
      return <Text>Loading...</Text>;
    }
    case "ready": {
      // function saveMoment() {}

      // const retakeMoment = () => {
      //   setCapturedImage(null);
      //   setPreviewVisible(false);
      // };

      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Camera
            style={{ flex: 1 }}
            type={facing}
            ref={cameraRef}
            onCameraReady={onCameraReady}
            flashMode={flash}
          >
            <Box style={{ flex: 1 }}>
              <View style={{ position: "absolute", top: 0, left: 0 }}>
                {/*
                        First pic preview ????????
                */}
              </View>
              <Fab
                renderInPortal={false}
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
                top={5}
                right={2}
                icon={
                  <Icon
                    color="white"
                    as={<MaterialIcons name="cameraswitch" />}
                    size={7}
                  />
                }
                onPress={() => toggleFacing()}
              />
              <Fab
                renderInPortal={false}
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
                top={5 + 65}
                right={2}
                icon={
                  <Icon
                    color="white"
                    as={
                      <MaterialIcons
                        name={
                          flash === FlashMode.off ? "flash-off" : "flash-on"
                        }
                      />
                    }
                    size={7}
                  />
                }
                onPress={() => toggleFlash()}
              />
              <Fab
                renderInPortal={false}
                style={{
                  height: 40,
                  width: 40,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
                top={65 + 50 + 5}
                right={2}
                icon={
                  <Icon
                    color="white"
                    as={<MaterialIcons name="info" />}
                    size={7}
                  />
                }
                onPress={() => toggleFacing()}
              />
              <Fab
                renderInPortal={false}
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
                bottom={5}
                right={2}
                icon={
                  <Icon
                    color={takingPicture ? "rgba(255, 255, 255, 0.6)" : "white"}
                    as={<MaterialCommunityIcons name="circle-slice-8" />}
                    size={10}
                  />
                }
                disabled={takingPicture}
                onPress={() => startTakingPictures()}
              />
              {/*
                  TO IMPLEMENT: Viewing pictures (picture recap at the end of marathon)

              <Fab
                renderInPortal={false}
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                }}
                bottom={5}
                left={2}
                icon={
                  <Icon
                    color="white"
                    as={<MaterialCommunityIcons name="dots-circle" />}
                    size={10}
                  />
                }
                onPress={() => reset()}
              /> */}
            </Box>
          </Camera>
        </View>
      );
    }
    case "captured": {
      if (!(images.front && images.back)) {
        Logger.error("State of DBMoments is invalid!", {
          source: "DBMomentsScreen",
          context: { images },
        });
      }

      console.log(images.front?.uri);
      console.log(images.back?.uri);

      return (
        <PreviewMoment
          frontImg={images.front}
          backImg={images.back}
          reset={reset}
        />
      );
    }
  }
};
