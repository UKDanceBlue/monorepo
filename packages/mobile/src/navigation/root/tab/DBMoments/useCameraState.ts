import type {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraProps,
  CameraType,
  CameraViewRef,
  FlashMode} from "expo-camera";
import {
  PermissionStatus,
  useCameraPermissions,
} from "expo-camera";
import type { MutableRefObject} from "react";
import { useEffect, useRef, useState } from "react";

import { Logger } from "#common/logger/Logger";
import { asyncWait } from "#common/util/wait";

type CameraState =
  | "permission-blocked"
  | "permission-ask"
  | "loading"
  | "ready"
  | "captured";

const takePicture = async (camera: CameraViewRef) => {
  const options: CameraPictureOptions = {
    quality: 1,
    base64: false,
    skipProcessing: false,
    isImageMirror: false,
  };
  // Need to wait when we take a picture to make sure the camera is focused
  await asyncWait(1200);
  return camera.takePicture(options);
};

export function useCameraState(): {
  flash: FlashMode;
  toggleFlash: (set?: FlashMode) => void;
  facing: CameraType;
  toggleFacing: (set?: CameraType) => void;
  cameraRef: MutableRefObject<CameraViewRef | undefined>;
  onCameraReady: CameraProps["onCameraReady"];
  images: Partial<Record<CameraType, CameraCapturedPicture>>;
  state: CameraState;
  requestPermission: () => void;
  startTakingPictures: () => void;
  reset: () => void;
  takingPicture: boolean;
} {
  const [flash, setFlash] = useState<FlashMode>("off");
  const [facing, setFacing] = useState<CameraType>("front");
  const [currentlyTaking, setCurrentlyTaking] = useState<
    Record<CameraType, boolean>
  >({
    front: false,
    back: false,
  });
  const [images, setImages] = useState<
    Partial<Record<CameraType, CameraCapturedPicture>>
  >({});
  const [cameraLoading, setCameraLoading] = useState(true);

  const cameraRef = useRef<CameraViewRef>();

  const [cameraPermission, requestCameraPermissions] = useCameraPermissions();

  let state: CameraState = "loading";
  switch (cameraPermission?.status) {
    case PermissionStatus.DENIED: {
      state = "permission-blocked";
      break;
    }
    case PermissionStatus.UNDETERMINED: {
      state = "permission-ask";
      break;
    }
    default: {
      state = images.front && images.back ? "captured" : "ready";
    }
  }

  const toggleFlash = (set?: FlashMode) => {
    setFlash((prev) => set ?? (prev === "off" ? "on" : "off"));
  };

  const toggleFacing = (set?: CameraType) => {
    setFacing((prev) => set ?? (prev === "front" ? "back" : "front"));
  };

  const requestPermission = () => {
    requestCameraPermissions().catch((error: unknown) =>
      Logger.error("Failed to request camera permissions", { error })
    );
  };

  const startTakingPictures = () => {
    if (cameraRef.current === null) {
      Logger.error("Camera ref is null");
      return;
    } else if (currentlyTaking[facing]) {
      Logger.warn("Already taking picture");
      return;
    } else {
      setCurrentlyTaking((prev) => ({ ...prev, [facing]: true }));
    }
  };

  const onCameraReady: CameraProps["onCameraReady"] = () => {
    console.log("Camera is ready");
    setCameraLoading(false);
  };

  useEffect(() => {
    if (cameraLoading || !cameraRef.current) {
      return;
    }

    const checking = facing;

    Logger.debug("Checking Camera", {
      context: { checking, currentlyTaking, images, time: Date.now() },
      source: "useCameraState",
    });

    // We always take a picture with whatever the current facing is
    if (currentlyTaking[checking]) {
      if (!images[checking]) {
        takePicture(cameraRef.current)
          .then((picture) => {
            setImages((prev) => ({ ...prev, [checking]: picture }));

            toggleFacing();
            setTimeout(() => {
              setCurrentlyTaking((prev) => ({
                ...prev,
                [checking === "front" ? "back" : "front"]: true,
              }));
            }, 3000);
          })
          .catch((error: unknown) => {
            Logger.error("Failed to take picture", { error });
          })
          .finally(() => {
            setCurrentlyTaking((prev) => ({ ...prev, [checking]: false }));
          });
      }
    }
  }, [cameraLoading, currentlyTaking, facing, images]);

  const reset = () => {
    setImages({});
    setCurrentlyTaking({
      front: false,
      back: false,
    });
  };

  return {
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
    takingPicture: currentlyTaking.front || currentlyTaking.back,
  };
}
