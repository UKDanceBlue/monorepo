import { marathonInterval } from "@common/marathonTime";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";


import { HourScreenComponent } from "./HourScreenComponent";
import { MarathonCountdownScreen } from "./MarathonCountdownScreen";

export const MarathonScreen = () => {
  const showingCountdown = useRef(false);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = DateTime.local();
      const isMarathonTime = marathonInterval.contains(now);
      if (isMarathonTime !== !showingCountdown.current) {
        showingCountdown.current = !showingCountdown.current;
        setShowCountdown(showingCountdown.current);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return showCountdown ? <MarathonCountdownScreen /> : <HourScreenComponent />;
};
