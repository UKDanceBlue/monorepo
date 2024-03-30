import { Logger } from "@common/logger/Logger";
import { asyncWait } from "@common/util/wait";
import type {
  CameraCapturedPicture,
  CameraPictureOptions,
  CameraProps,
} from "expo-camera";
import { Camera, CameraType, FlashMode, PermissionStatus } from "expo-camera";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

type CameraState =
  | "permission-blocked"
  | "permission-ask"
  | "loading"
  | "ready"
  | "captured";

const takePicture = async (camera: Camera) => {
  const options: CameraPictureOptions = {
    quality: 1,
    base64: false,
    skipProcessing: false,
    isImageMirror: false,
  };
  // Need to wait when we take a picture to make sure the camera is focused
  await asyncWait(1200);
  return camera.takePictureAsync(options);
};

export function useCameraState(): {
  flash: FlashMode;
  toggleFlash: (set?: FlashMode) => void;
  facing: CameraType;
  toggleFacing: (set?: CameraType) => void;
  cameraRef: RefObject<Camera>;
  onCameraReady: CameraProps["onCameraReady"];
  images: {
    [CameraType.front]?: CameraCapturedPicture;
    [CameraType.back]?: CameraCapturedPicture;
  };
  state: CameraState;
  requestPermission: () => void;
  startTakingPictures: () => void;
  reset: () => void;
  takingPicture: boolean;
} {
  const [flash, setFlash] = useState<FlashMode>(FlashMode.off);
  const [facing, setFacing] = useState<CameraType>(CameraType.front);
  const [currentlyTaking, setCurrentlyTaking] = useState<{
    [CameraType.front]: boolean;
    [CameraType.back]: boolean;
  }>({
    [CameraType.front]: false,
    [CameraType.back]: false,
  });
  const [images, setImages] = useState<{
    [CameraType.front]?: CameraCapturedPicture;
    [CameraType.back]?: CameraCapturedPicture;
  }>({});
  const [cameraLoading, setCameraLoading] = useState(true);

  const cameraRef = useRef<Camera>(null);

  const [cameraPermission, requestCameraPermissions] =
    Camera.useCameraPermissions();

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
      // eslint-disable-next-line unicorn/prefer-ternary
      if (images[CameraType.front] && images[CameraType.back]) {
        state = "captured";
      } else {
        state = "ready";
      }
    }
  }

  const toggleFlash = (set?: FlashMode) => {
    setFlash(
      (prev) => set ?? (prev === FlashMode.off ? FlashMode.on : FlashMode.off)
    );
  };

  const toggleFacing = (set?: CameraType) => {
    setFacing(
      (prev) =>
        set ?? (prev === CameraType.front ? CameraType.back : CameraType.front)
    );
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
            setCurrentlyTaking((prev) => ({
              ...prev,
              [checking === CameraType.front
                ? CameraType.back
                : CameraType.front]: true,
            }));
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
      [CameraType.front]: false,
      [CameraType.back]: false,
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
    takingPicture:
      currentlyTaking[CameraType.front] || currentlyTaking[CameraType.back],
  };
}
