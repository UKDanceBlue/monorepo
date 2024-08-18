import { DateTime, Duration, Interval } from "luxon";
import { View } from "native-base";
import { useEffect, useState } from "react";

import { useThemeColors } from "../../customHooks";
import { CountdownNumber } from "./CountdownNumber";

export const CountdownViewNew = ({ endTime }: { endTime: number }) => {
  const [countdownDisplayDuration, setCountdownDisplayDuration] =
    useState<Duration>(Duration.fromMillis(0));
  const [_showZeros, setShowZeros] = useState(false);
  const { primary: _primary } = useThemeColors();

  useEffect(() => {
    // 1 second timer
    const timer = setInterval(() => {
      const interval = Interval.fromDateTimes(
        DateTime.now(),
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
          "seconds",
          "milliseconds"
        )
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [endTime]);

  // console.log(countdownDisplayDuration.toObject());

  const countdown =
    countdownDisplayDuration.months > 0 ? (
      <>
        <CountdownNumber
          value={countdownDisplayDuration.months}
          unit={"months"}
          total={31}
          radius={55}
          amountInRow={3}
        />
        <CountdownNumber
          value={countdownDisplayDuration.days}
          unit={"days"}
          total={31}
          radius={55}
          amountInRow={3}
        />
        <CountdownNumber
          value={countdownDisplayDuration.hours}
          unit={"hours"}
          total={31}
          radius={55}
          amountInRow={3}
        />
      </>
    ) : countdownDisplayDuration.days > 0 ? (
      <>
        <CountdownNumber
          value={countdownDisplayDuration.days}
          unit={"days"}
          total={31}
          radius={55}
          amountInRow={3}
        />
        <CountdownNumber
          value={countdownDisplayDuration.hours}
          unit={"hours"}
          total={31}
          radius={55}
          amountInRow={3}
        />
        <CountdownNumber
          value={countdownDisplayDuration.minutes}
          unit={"min"}
          total={31}
          radius={55}
          amountInRow={3}
        />
      </>
    ) : (
      <>
        <CountdownNumber
          value={countdownDisplayDuration.hours}
          unit={"hours"}
          total={31}
          radius={55}
          amountInRow={3}
        />
        <CountdownNumber
          value={countdownDisplayDuration.minutes}
          unit={"min"}
          total={31}
          radius={55}
          amountInRow={3}
        />
        <CountdownNumber
          value={countdownDisplayDuration.seconds}
          unit={"sec"}
          total={31}
          radius={55}
          amountInRow={3}
        />
      </>
    );

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
        {countdown}
      </View>
    </View>
  );
};
