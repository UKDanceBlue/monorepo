import { DateTime, Duration, Interval } from "luxon";
import { View } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import { useThemeColors } from "../../customHooks";

import { CountdownNumber } from "./CountdownNumber";

export const CountdownViewNew = ({ endTime }: { endTime: number }) => {
  const [countdownDisplayDuration, setCountdownDisplayDuration] =
    useState<Duration>(Duration.fromMillis(0));
  const [showZeros, setShowZeros] = useState(false);
  const { primary } = useThemeColors();

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      const interval = Interval.fromDateTimes(
        new Date(),
        DateTime.fromMillis(endTime)
      );
      let duration = interval.toDuration();
      if (!interval.isValid) {
        duration = Duration.fromMillis(0);
        setShowZeros(true);
      }
      // Get time components
      setCountdownDisplayDuration(
        duration.shiftTo(
          "years",
          "months",
          "days",
          "hours",
          "minutes",
          "seconds"
        )
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

  // console.log(countdownDisplayDuration.toObject());

  return (
    <View style={styles.container}>
      <View style={styles.countdownTimer}>
        <CountdownNumber/>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  countdownTimer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
  },
});

export default CountdownView;
