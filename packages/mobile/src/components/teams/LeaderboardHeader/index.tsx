import { useState } from "react";
import ViewPager from "react-native-pager-view";

import {
  getLeaderboardHeaderContents,
  type LeaderboardHeaderProps,
} from "./LeaderBoardHeaderContent";

export function LeaderboardHeader(props: LeaderboardHeaderProps) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  return (
    <ViewPager style={{ minHeight: dimensions.height }} initialPage={0}>
      {getLeaderboardHeaderContents({
        ...props,
        setDimensions,
      })}
    </ViewPager>
  );
}
