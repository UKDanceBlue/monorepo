import type { CameraCapturedPicture } from "expo-camera";
import { DateTime } from "luxon";
import { Box, HStack, Image, Text, View } from "native-base";
import type { Ref } from "react";
import React, { useEffect, useState } from "react";
import {
  Image as RNImage,
  ImageBackground,
  useWindowDimensions,
} from "react-native";

import dbMonogram from "@/assets/logo/monogram.png";
import {
  type MarathonTime,
  useMarathonTime,
} from "@/common/hooks/useMarathonTime";

function calculateDBYear() {
  const currentYear = DateTime.now().year.toString().slice(-2);
  return `Marathon '${currentYear}`;
}

function calculateMarathonHour(marathonTime: MarathonTime) {
  const currentTime = DateTime.now();

  if (currentTime < marathonTime.startTime.minus({ hours: 5 })) {
    return "Pre-Marathon";
  } else if (
    currentTime >= marathonTime.startTime.minus({ hours: 5 }) &&
    currentTime < marathonTime.startTime
  ) {
    const hoursDiff = marathonTime.startTime.diff(currentTime, "hours").hours;
    return `T-${hoursDiff.toFixed(0)} Hours`;
  } else if (
    currentTime >= marathonTime.startTime &&
    currentTime <= marathonTime.endTime
  ) {
    const hoursDiff =
      currentTime.diff(marathonTime.startTime, "hours").hours + 1;
    return `Hour ${hoursDiff.toFixed(0)}`;
  } else {
    return "Post-Marathon";
  }
}

export const HiddenComponent = ({
  front,
  back,
  viewRef,
  setViewSize,
}: {
  front: CameraCapturedPicture | undefined;
  back: CameraCapturedPicture | undefined;
  viewRef: Ref<typeof View>;
  setViewSize: (param: { width: number; height: number }) => void;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [frontImgHeight, setFrontImgHeight] = useState(0);
  const maxWidth = screenWidth / 3;
  const { marathonTime } = useMarathonTime();

  useEffect(() => {
    if (front?.uri) {
      RNImage.getSize(front.uri, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        const newHeight = maxWidth / aspectRatio;
        setFrontImgHeight(newHeight);
      });
    }
  }, [front?.uri, maxWidth]);

  return (
    <View
      style={{ flex: 1 }}
      ref={viewRef}
      onLayout={({
        nativeEvent: {
          layout: { height, width },
        },
      }) => {
        setViewSize({ width, height });
      }}
    >
      <ImageBackground source={{ uri: back?.uri }} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              shadowColor: "rgba(255, 199, 44, 1)",
              shadowOffset: { width: 0, height: 0 }, // Offset of the shadow
              shadowRadius: 10, // Radius of the shadow (controls intensity)
              shadowOpacity: 0.7, // Full opacity for the glow
            }}
          >
            <Image
              source={{ uri: front?.uri }}
              style={{
                width: maxWidth,
                height: frontImgHeight,
                borderColor: "#0032a0",
                borderWidth: 2,
                borderRadius: 5,
                marginTop: 10,
                marginLeft: 10,
              }}
              resizeMode="contain"
              alt="Front DBMoments Image"
            />
          </View>
        </View>
        <View style={{ padding: 15, alignItems: "flex-end" }}>
          <Box alignItems="center">
            <HStack>
              <Image
                source={dbMonogram}
                alt="DB Logo Condensed"
                width={100}
                height={100}
                resizeMode="contain"
              />
            </HStack>
            <HStack>
              <Text
                textAlign="center"
                style={{
                  color: "rgba(255, 255, 255, 1)", // White text color
                  textShadowColor: "rgba(255, 199, 44, 1)", // Yellow glow color
                  textShadowOffset: { width: 0, height: 0 }, // Offset of the shadow
                  textShadowRadius: 4,
                }}
              >
                {/*
                      Need to figure out how to calculate this so that it automatically updates
                */}
                {calculateDBYear()}
              </Text>
            </HStack>
            <HStack>
              <Text
                textAlign="center"
                fontSize={20}
                marginTop={-3}
                style={{
                  color: "rgba(255, 255, 255, 1)", // White text color
                  textShadowColor: "rgba(255, 199, 44, 1)", // Yellow glow color
                  textShadowOffset: { width: 0, height: 0 }, // Offset of the shadow
                  textShadowRadius: 4,
                }}
              >
                {/*
                    Need to figure out how to calculate this so that it automatically updates
                */}
                {calculateMarathonHour(marathonTime)}
              </Text>
            </HStack>
          </Box>
        </View>
      </ImageBackground>
    </View>
  );
};
