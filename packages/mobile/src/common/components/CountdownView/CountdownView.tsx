import { DateTime, Duration, Interval } from "luxon";
import { View } from "native-base";
import { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

import { useThemeColors } from "../../customHooks";
import TimeUnit from "../TimeUnit";

const CountdownView = ({ endTime }: { endTime: number }) => {
  const [ countdownDisplayDuration, setCountdownDisplayDuration ] = useState<Duration>(Duration.fromMillis(0));
  const [ showZeros, setShowZeros ] = useState(false);
  const { primary } = useThemeColors();

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      const interval = Interval.fromDateTimes(new Date(), DateTime.fromMillis(endTime));
      let duration = interval.toDuration();
      if (!interval.isValid) {
        duration = Duration.fromMillis(0);
        setShowZeros(true);
      }
      // Get time components
      setCountdownDisplayDuration(
        duration.shiftTo("years", "months", "days", "hours", "minutes", "seconds")
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
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) > 0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} flex={1}>
              <TimeUnit unit="years" value={countdownDisplayDuration.years} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) + Number(!!countdownDisplayDuration.months) > 0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} flex={1}>
              <TimeUnit unit="months" value={countdownDisplayDuration.months} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) >
                0 && (
            <View bgColor={`${primary[700]}BD`} marginX={2} flex={1}>
              <TimeUnit unit="days" value={countdownDisplayDuration.days} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          ((Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) +
                Number(!!countdownDisplayDuration.hours) >
                0) || showZeros) && (
            <TimeUnit unit="hours" value={countdownDisplayDuration.hours} />
          )
        }
        {
          // Check that this or any previous unit is nonzero
          ((Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) +
                Number(!!countdownDisplayDuration.hours) +
                Number(!!countdownDisplayDuration.minutes) >
                0) || showZeros) && (
            <View bgColor={`${primary[700]}BD`} marginX={2} flex={1}>
              <TimeUnit unit="min" value={countdownDisplayDuration.minutes} />
            </View>
          )
        }
        {
          // Check that this or any previous unit is nonzero
          ((Number(!!countdownDisplayDuration.years) +
                Number(!!countdownDisplayDuration.months) +
                Number(!!countdownDisplayDuration.days) +
                Number(!!countdownDisplayDuration.hours) +
                Number(!!countdownDisplayDuration.minutes) +
                Number(!!countdownDisplayDuration.seconds) >
                0) || showZeros) && (
            <View bgColor={`${primary[700]}BD`} marginX={2} flex={1}>
              <TimeUnit unit="sec" value={Math.trunc(countdownDisplayDuration.seconds)} />
            </View>
          )
        }
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  countdownTimer: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1
  }
});

export default CountdownView;
