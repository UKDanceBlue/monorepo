import dbWordLogo from "@assets/logo/big-words.png";
import dbMonogram from "@assets/logo/monogram.png";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import type { CameraCapturedPicture, CameraPictureOptions } from "expo-camera";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { Box, Button, Fab, HStack, Icon, Image, Text, View } from "native-base";
import { useRef, useState } from "react";
import { ImageBackground, useWindowDimensions } from "react-native";

export const DBMomentsScreen = () => {
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const { height: screenHeight } = useWindowDimensions();
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture>();
  const [previewVisible, setPreviewVisible] = useState(false);

  const cameraRef = useRef<Camera>(null);

  // relative heights based on jackson's iphone aspect ratio
  const headerBias = (98 / 932) * screenHeight;
  const invHeaderBias = screenHeight - headerBias;
  const navBias = ((932 - 94) / 932) * screenHeight; // will not need once nav is changed
  const invNavBias = screenHeight - navBias; // will not need once nav is changed

  let flashComponent = (
    <Fab
      renderInPortal={false}
      style={{ height: 40, width: 40, backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      top={5 + 65}
      right={2}
      icon={
        <Icon color="white" as={<MaterialIcons name="flash-off" />} size={7} />
      }
      onPress={toggleFlash}
    />
  );

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
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

  function toggleCameraType() {
    // just to figure out maths for FAB placements
    console.log(`total height: ${screenHeight}`);
    console.log(`header bias: ${headerBias}`);
    console.log(`inv header bias: ${invHeaderBias}`);
    console.log(`nav bias: ${navBias}`);
    console.log(`inv nav bias: ${invNavBias}`);

    setCameraType((current) =>
      current === CameraType.front ? CameraType.back : CameraType.front
    );
  }

  function toggleFlash() {
    if (flash === FlashMode.on) {
      flashComponent = (
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
              as={<MaterialIcons name="flash-off" />}
              size={7}
            />
          }
          onPress={toggleFlash}
        />
      );
      console.log("turning flash off");
      setFlash(FlashMode.off);
    } else {
      flashComponent = (
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
              as={<MaterialIcons name="flash-on" />}
              size={7}
            />
          }
          onPress={toggleFlash}
        />
      );
      console.log("turning flash on");
      setFlash(FlashMode.on);
    }
  }

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      const options: CameraPictureOptions = {
        quality: 0.8,
        base64: true,
        skipProcessing: true,
        isImageMirror: false,
      };
      const photo = await cameraRef.current.takePictureAsync(options);
      console.log(photo.uri);
      /*
      if (cameraType === CameraType.front) {
        photo = await manipulateAsync(
          photo.uri,
          [
              { rotate: 180 },
              { flip: FlipType.Vertical },
          ],
          { compress: 1, format: SaveFormat.JPEG }
        );
      }
      */
      setPreviewVisible(true);
      setCapturedImage(photo);
    } else {
      console.log("photo is null idk");
    }
  };

  const PreviewPicture = () => {
    console.log("sdsfds", capturedImage?.uri);
    if (capturedImage) {
      return (
        <View
          style={{
            backgroundColor: "transparent",
            flex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          <ImageBackground
            source={{ uri: capturedImage.uri }}
            style={{ flex: 1 }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                padding: 15,
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Box alignItems="center">
                  <HStack>
                    <Image
                      source={dbMonogram}
                      alt="DB Logo Condensed"
                      width={100}
                      height={100}
                      resizeMode="contain"
                    />

                    {/* REPLACE WITH THIS
                  <DBLogoCondensed svgProps={{ width: 100, height: 100 }} letterColor="rgba(255,255,255,0.6)" ribbonColor="rgba(255,255,255,0.6)"/>
                  */}
                  </HStack>
                  <HStack>
                    <Text
                      width={100}
                      textAlign={"center"}
                      color="rgba(255, 255, 255, 0.6)"
                    >
                      Marathon '24
                    </Text>
                  </HStack>
                  <HStack>
                    <Text
                      width={100}
                      textAlign={"center"}
                      color="rgba(255, 255, 255, 0.6)"
                      fontSize={20}
                      marginTop={-3}
                    >
                      Hour 24
                    </Text>
                  </HStack>
                </Box>
              </View>
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      return null;
    }
  };

  // function saveMoment() {}

  // const retakeMoment = () => {
  //   setCapturedImage(null);
  //   setPreviewVisible(false);
  // };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {previewVisible && capturedImage ? (
        <PreviewPicture />
      ) : (
        <Camera
          style={{ flex: 1 }}
          type={cameraType}
          ref={cameraRef}
          onCameraReady={() => setCameraReady(true)}
          flashMode={flash}
        >
          <Box style={{ flex: 1 }}>
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
              onPress={toggleCameraType}
            />
            {flashComponent}
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
              onPress={toggleCameraType}
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
                  color="white"
                  as={<MaterialCommunityIcons name="circle-slice-8" />}
                  size={10}
                />
              }
              onPress={takePicture}
            />
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
              onPress={toggleCameraType}
            />
          </Box>
        </Camera>
      )}
    </View>
  );
};
