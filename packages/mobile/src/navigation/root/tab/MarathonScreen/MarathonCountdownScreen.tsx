import CountdownView from "@common/components/CountdownView";
import { useThemeColors } from "@common/customHooks";
import type { DateTime } from "luxon";
import { Text, View } from "native-base";
import type { ImageSourcePropType } from "react-native";
import { ImageBackground, useWindowDimensions } from "react-native";

import CommitteeHoldingSign from "../../../../../assets/svgs/CommitteeHoldingSign";

/**
 * @param params.countdownTo Countdown target in milliseconds
 */
export const MarathonCountdownScreen = ({
  marathonYear,
  marathonStart,
  marathonEnd,
}: {
  marathonYear: string;
  marathonStart: DateTime;
  marathonEnd: DateTime;
}) => {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { primary } = useThemeColors();
  return (
    <ImageBackground
      source={
        require("../../../../../assets/bg-geometric/blue.png") as ImageSourcePropType
      }
      resizeMode="cover"
      style={{ width: screenWidth, height: screenHeight, flex: 1 }}
    >
      <View flex={1} marginBottom="4">
        <Text
          textAlign="center"
          color="secondary.400"
          fontFamily="headingBold"
          fontSize="3xl"
          bg={`${primary[600]}BD`}
          marginTop="4"
          style={{
            textShadowColor: "secondary.300",
            textShadowOffset: { width: 2, height: 1.5 },
            textShadowRadius: 1,
          }}
        >
          {`Countdown 'til ${marathonYear}`}
        </Text>
        <CountdownView endTime={marathonStart.toMillis()} />
      </View>
      <View flex={2}>
        <CommitteeHoldingSign color="#fff" />
      </View>
      <View flex={1}>
        <Text
          textAlign="center"
          color="secondary.400"
          fontFamily="headingBold"
          fontSize="3xl"
          bg={`${primary[600]}BD`}
          style={{
            textShadowColor: "secondary.300",
            textShadowOffset: { width: 2, height: 1.5 },
            textShadowRadius: 1,
          }}
        >
          {`${marathonStart.toFormat("MMMM d")} - ${marathonEnd.toFormat(
            "MMMM d, yyyy"
          )}`}
        </Text>
        <Text
          textAlign="center"
          color="secondary.400"
          fontFamily="body"
          fontSize="2xl"
          bg={`${primary[600]}BD`}
        >
          {`${marathonStart.toFormat("h:mm a")} - ${marathonEnd.toFormat(
            "h:mm a"
          )}`}
        </Text>
      </View>
    </ImageBackground>
  );
};
