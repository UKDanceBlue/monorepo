import { MaterialIcons } from "@expo/vector-icons";
import type { CameraCapturedPicture } from "expo-camera";
import type { View } from "native-base";
import { Fab, Icon, ZStack } from "native-base";
import React, { useRef, useState } from "react";
import { captureRef } from "react-native-view-shot";

import { Logger } from "@/common/logger/Logger";
import { showMessage } from "@/common/util/alertUtils";

import { HiddenComponent } from "./HiddenComponent";
import { useSaveMoment } from "./useSaveMoment";

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

  const { saveMoment, ask } = useSaveMoment();

  const captureMoment = async (): Promise<void> => {
    if (ask) {
      return ask().then(() => captureMoment());
    }
    if (saveMoment) {
      try {
        const uri = await captureRef(viewRef, {
          format: "jpg", // Specify the format of the captured image
          quality: 0.8, // Specify the image quality (0.0 to 1.0)
          width: viewSize.width, // Specify the width of the captured image
          height: viewSize.height, // Specify the height of the captured image
        });

        // Implement logic to save or share the captured image URI
        await saveMoment(uri);

        showMessage("Check your camera roll", "Moment saved!");
      } catch (error) {
        console.error("Capture failed:", error);
      }
    }
  };

  return (
    <ZStack style={{ flex: 1 }}>
      <HiddenComponent
        front={frontImg}
        back={backImg}
        viewRef={viewRef}
        setViewSize={setViewSize}
      />
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
          <Icon color="white" as={<MaterialIcons name="save-alt" />} size={7} />
        }
        onPress={() =>
          captureMoment().catch((error: unknown) =>
            Logger.error("Capture failed", { error })
          )
        }
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
    </ZStack>
  );
};
