// import CountdownView from "@common/components/CountdownView/CountdownView";
import CountdownViewNew from "@common/components/CountdownView";
import { useThemeColors } from "@common/customHooks";
import type { DateTime } from "luxon";
import { Text, View } from "native-base";
import { useState } from "react";
import type { ImageSourcePropType } from "react-native";
import { ImageBackground, useWindowDimensions } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import CommitteeHoldingSign from "../../../../../assets/svgs/CommitteeHoldingSign";

export const MarathonCountdownScreen = ({
  marathonStart,
  marathonEnd,
  showSecretMenu,
}: {
  marathonStart: DateTime;
  marathonEnd: DateTime;
  showSecretMenu: () => void;
}) => {
  const [secretGestureState, setSecretGestureState] = useState<0 | 1 | 2 | 3>(
    0
  );

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { primary } = useThemeColors();

  const ordinals = ["th", "st", "nd", "rd"]; // s
  const startOrdinal =
    ordinals[((marathonStart.day % 100) - 20) % 10] ||
    ordinals[marathonStart.day % 100] ||
    ordinals[0];
  const endOrdinal =
    ordinals[((marathonEnd.day % 100) - 20) % 10] ||
    ordinals[marathonEnd.day % 100] ||
    ordinals[0];

  // technically this isn't the best way of doing the date but idrc atm
  const dateString = `${marathonStart.toFormat("LLLL d")}${startOrdinal} - ${marathonEnd.toFormat("d, yyyy").replace(",", `${endOrdinal},`)}`;

  const timeString = `${marathonStart.toFormat("h:mm a")} - ${marathonEnd.toFormat("h:mm a")}`;

  return (
    <ImageBackground
      source={
        require("../../../../../assets/bg-geometric/blue.png") as ImageSourcePropType
      }
      resizeMode="cover"
      style={{ width: screenWidth, height: screenHeight, flex: 1 }}
    >
      <View flex={1} marginBottom="4">
        <TouchableWithoutFeedback onPress={() => setSecretGestureState(1)}>
          <Text
            textAlign="center"
            color="secondary.400"
            fontFamily="headingBold"
            fontSize="3xl"
            bg={`${primary[600]}BD`}
            marginTop="4"
          >
            {"Countdown 'til Marathon"}
          </Text>
        </TouchableWithoutFeedback>
        <CountdownViewNew endTime={marathonStart.toMillis()} />
      </View>
      <View flex={2}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (secretGestureState === 3) {
              showSecretMenu();
            }
            setSecretGestureState(0);
          }}
        >
          <CommitteeHoldingSign color="#fff" />
        </TouchableWithoutFeedback>
      </View>
      <View flex={0.6}>
        <TouchableWithoutFeedback
          onPress={() => setSecretGestureState((old) => (old === 2 ? 3 : 1))}
        >
          <Text
            textAlign="center"
            color="secondary.400"
            fontFamily="headingBold"
            fontSize="3xl"
            bg={`${primary[600]}BD`}
          >
            {dateString}
          </Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => setSecretGestureState((old) => (old === 1 ? 2 : 0))}
        >
          <Text
            textAlign="center"
            color="secondary.400"
            fontFamily="body"
            fontSize="2xl"
            bg={`${primary[600]}BD`}
          >
            {timeString}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  );
};
