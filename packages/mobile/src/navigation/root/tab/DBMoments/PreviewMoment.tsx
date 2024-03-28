import { MaterialIcons } from "@expo/vector-icons";
import type { CameraCapturedPicture } from "expo-camera";
import { Fab, Icon, View } from "native-base";
import React, { useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";

import { HiddenComponent } from "./HiddenComponent";

export const PreviewMoment = ({
  frontImg,
  backImg,
  reset,
}: {
  frontImg: CameraCapturedPicture | undefined;
  backImg: CameraCapturedPicture | undefined;
  reset: () => void;
}) => {
  const viewRef = useRef<typeof View>(null);
  const [viewSize, setViewSize] = useState({ width: 0, height: 0 });
  const saveMoment = async () => {
    console.log("Saving moment...");
    try {
      console.log("Capturing image...", {
        width: viewSize.width,
        height: viewSize.height,
      });
      const uri = await captureRef(viewRef, {
        format: "jpg", // Specify the format of the captured image
        quality: 0.8, // Specify the image quality (0.0 to 1.0)
        width: viewSize.width, // Specify the width of the captured image
        height: viewSize.height, // Specify the height of the captured image
      });
      console.log("Image captured:", uri);
      // Implement logic to save or share the captured image URI
    } catch (error) {
      console.error("Capture failed:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HiddenComponent
        front={frontImg}
        back={backImg}
        viewRef={viewRef}
        setViewSize={setViewSize}
      />
      <View style={{ flex: 1 }}>
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
              as={<MaterialIcons name="save-alt" />}
              size={7}
            />
          }
          onPress={() => saveMoment()}
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
            <Icon color="white" as={<MaterialIcons name="replay" />} size={7} />
          }
          onPress={() => reset()}
        />
      </View>
    </View>
  );
};
