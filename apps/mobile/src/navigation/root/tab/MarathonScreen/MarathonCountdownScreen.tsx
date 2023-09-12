import { DateTime } from "luxon";
import { Image, Text, View } from "native-base";
import { ImageBackground, ImageSourcePropType, useWindowDimensions } from "react-native";

import CommitteeHoldingSign from "../../../../../assets/svgs/CommitteeHoldingSign";
import CountdownView from "../../../../common/components/CountdownView";
import { useThemeColors } from "../../../../common/customHooks";
import { marathonInterval } from "../../../../common/marathonTime";

export const MarathonCountdownScreen = () => {
  const {
    height: screenHeight, width: screenWidth
  } = useWindowDimensions();
  const { primary } = useThemeColors();
  return (
    <ImageBackground
      source={require("../../../../../assets/bg-geometric/blue.png") as ImageSourcePropType}
      resizeMode="cover"
      style={{ width: screenWidth, height: screenHeight, flex: 1 }}>
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
            textShadowRadius: 1
          }}>{"Countdown 'til Marathon"}</Text>
        <CountdownView endTime={marathonInterval.start.toMillis()} />
      </View>
      <View flex={2}>
        <CommitteeHoldingSign color="#fff"/>
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
            textShadowRadius: 1
          }}>{"March 25th - 26th, 2023"}</Text>
        <Text
          textAlign="center"
          color="secondary.400"
          fontFamily="body"
          fontSize="2xl"
          bg={`${primary[600]}BD`}>{"8:00 PM - 8:00 PM"}</Text>
      </View>
    </ImageBackground>
  );
};
