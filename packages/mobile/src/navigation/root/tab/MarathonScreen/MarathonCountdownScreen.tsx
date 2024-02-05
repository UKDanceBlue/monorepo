// import CountdownView from "@common/components/CountdownView/CountdownView";
import CountdownViewNew from "@common/components/CountdownView";
import { useThemeColors } from "@common/customHooks";
import { useMarathonTime } from "@common/hooks/useMarathonTime";
import { Interval } from "luxon";
import { Text, View } from "native-base";
import type { ImageSourcePropType } from "react-native";
import { ImageBackground, useWindowDimensions } from "react-native";

import CommitteeHoldingSign from "../../../../../assets/svgs/CommitteeHoldingSign";


export const MarathonCountdownScreen = () => {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { primary } = useThemeColors();
  const { marathonTime } = useMarathonTime();

  const ordinals = ["th", "st", "nd", "rd"]; // s
  const startOrdinal = ordinals[((marathonTime.startTime.day % 100) - 20) % 10]
                    || ordinals[marathonTime.startTime.day % 100]
                    || ordinals[0];
  const endOrdinal = ordinals[((marathonTime.endTime.day % 100) - 20) % 10]
                  || ordinals[marathonTime.startTime.day % 100]
                  || ordinals[0];

  // technically this isn't the best way of doing the date but idrc atm
  const dateString = `${marathonTime.startTime.toFormat('LLLL d')}${startOrdinal} - ${marathonTime.endTime.toFormat('d, yyyy').replace(',', `${endOrdinal},`)}`;

  const timeString = `${marathonTime.startTime.toFormat('h:mm a')} - ${marathonTime.endTime.toFormat('h:mm a')}`;

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
          {"Countdown 'til Marathon"}
        </Text>
        <CountdownViewNew endTime={Interval.fromDateTimes(marathonTime.startTime, marathonTime.endTime).start.toMillis()} />
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
          {dateString}
        </Text>
        <Text
          textAlign="center"
          color="secondary.400"
          fontFamily="body"
          fontSize="2xl"
          bg={`${primary[600]}BD`}
        >
          {timeString}
        </Text>
      </View>
    </ImageBackground>
  );
};
