import { Box, Button, Fab, Icon, Image, Text, View } from "native-base";
import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import dbWordLogo from "@assets/logo/big-words.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons } from '@expo/vector-icons';

export const DBMomentsScreen = () => {
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View alignItems={"center"} height="100%" justifyContent={"center"}>
        <Image
        source={dbWordLogo}
        alt="DB Word Logo"
        size="2xl"/>
        <Text
        fontSize="md"
        marginTop={5}>
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
    setCameraType(current => (current === CameraType.front ? CameraType.back : CameraType.front));
  }

  return (
    <View style={{flex: 1, justifyContent: "center"}}>
      <Camera style={{flex: 1}} type={cameraType}>
        <Box style={{flex: 1, marginTop: 25}}>
          <Fab style={{padding: 0}} placement={"top-right"} icon={<Icon color="white" as={<MaterialIcons name="cameraswitch"/>} size={5} />} onPress={toggleCameraType}/>
          <Fab style={{padding: 0}} placement={"bottom-right"} icon={<Icon color="white" as={<MaterialIcons name="cameraswitch"/>} size={5} />} onPress={toggleCameraType}/>
          <Fab style={{padding: 0}} placement={"bottom-left"} icon={<Icon color="white" as={<MaterialIcons name="cameraswitch"/>} size={5} />} onPress={toggleCameraType}/>
        </Box>
      </Camera>
    </View>
  );
};
