import { useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

import {
  getLeaderboardHeaderContents,
  type LeaderboardHeaderProps,
} from "./LeaderBoardHeaderContent";

export function LeaderboardHeader(props: LeaderboardHeaderProps) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const { width } = useWindowDimensions();

  return (
    <ScrollView
      pagingEnabled
      horizontal
      style={{ minHeight: dimensions.height }}
      contentContainerStyle={{ width: "100%" }}
    >
      {getLeaderboardHeaderContents({ ...props, setDimensions, width })}
    </ScrollView>
  );
}
