import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { Pager } from "~/components/ui/pager";

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
    <Pager style={{ minHeight: dimensions.height }}>
      {getLeaderboardHeaderContents({ ...props, setDimensions, width })}
    </Pager>
  );
}
