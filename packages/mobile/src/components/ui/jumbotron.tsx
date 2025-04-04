import { ImageBackground } from "expo-image";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { View } from "react-native";

import BlueGeometric from "~/assets/bg-geometric/blue.png";
import LightBlueGeometric from "~/assets/bg-geometric/lightblue.png";
import WhiteGeometric from "~/assets/bg-geometric/white.png";

import { Text } from "./text";

const Jumbotron = ({
  icon,
  title,
  subTitle,
  bodyText,
  geometric = false,
  ...viewProps
}: {
  icon?: ReactNode;
  title?: string;
  subTitle?: string;
  bodyText?: string;
  geometric?: "white" | "blue" | "lightblue" | false;
} & ViewProps) => {
  const content = (
    <>
      {icon}
      {title && (
        <Text
          // textAlign="center"
          // fontSize="2xl"
          // color="primary.600"
          // fontFamily="headingBold"
          // bold
          className="text-center text-3xl color-primary font-bodoni-bold font-bold"
        >
          {title}
        </Text>
      )}
      {subTitle && (
        <Text className="text-center text-xl color-primary font-bold">
          {subTitle}
        </Text>
      )}
      {bodyText && (
        <Text className="text-center text-lg color-primary font-normal">
          {bodyText}
        </Text>
      )}
    </>
  );

  const classStr =
    "m-2 p-4 w-[95vw] pt-6 items-center flex flex-1 flex-col justify-evenly";

  if (geometric) {
    let image;
    switch (geometric) {
      case "white": {
        image = WhiteGeometric;
        break;
      }
      case "blue": {
        image = BlueGeometric;
        break;
      }
      case "lightblue": {
        image = LightBlueGeometric;
        break;
      }
    }

    return (
      <ImageBackground source={image}>
        <View {...viewProps} className={`${classStr} ${viewProps.className}`}>
          {content}
        </View>
      </ImageBackground>
    );
  } else {
    return (
      <View
        {...viewProps}
        className={`bg-blue-300 ${classStr} ${viewProps.className}`}
      >
        {content}
      </View>
    );
  }
};

export default Jumbotron;
