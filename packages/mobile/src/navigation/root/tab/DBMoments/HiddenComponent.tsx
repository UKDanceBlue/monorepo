import dbMonogram from "@assets/logo/monogram.png";
import type { CameraCapturedPicture } from "expo-camera";
import { Box, HStack, Image, Text, View } from "native-base";
import type { Ref } from "react";
import React, { useEffect, useState } from "react";
import { ImageBackground, useWindowDimensions } from "react-native";

export const HiddenComponent = ({
  front,
  back,
  viewRef,
}: {
  front: CameraCapturedPicture | undefined;
  back: CameraCapturedPicture | undefined;
  viewRef: Ref<typeof View>;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [frontImgHeight, setFrontImgHeight] = useState(0);
  const maxWidth = screenWidth / 3;

  useEffect(() => {
    const getImageSize = () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Image.getSize(front?.uri, (imgWidth, imgHeight) => {
        const aspectRatio = imgWidth / imgHeight;
        const newHeight = maxWidth / aspectRatio;
        setFrontImgHeight(newHeight);
      });
    };
    getImageSize();
  }, [front?.uri, maxWidth]);

  return (
    <View style={{ flex: 1 }} ref={viewRef}>
      <ImageBackground source={{ uri: back?.uri }} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
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
              <Text textAlign="center" color="rgba(255, 255, 255, 0.6)">
                {/*
                      Need to figure out how to calculate this so that it automatically updates
                */}
                Marathon '24
              </Text>
            </HStack>
            <HStack>
              <Text
                textAlign="center"
                color="rgba(255, 255, 255, 0.6)"
                fontSize={20}
                marginTop={-3}
              >
                {/*
                    Need to figure out how to calculate this so that it automatically updates
                */}
                Hour 24
              </Text>
            </HStack>
          </Box>
        </View>
      </ImageBackground>
    </View>
  );
};
