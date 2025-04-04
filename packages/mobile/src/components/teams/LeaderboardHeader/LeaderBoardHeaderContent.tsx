import { ordinalString } from "@ukdanceblue/common";
import { type Dispatch, type SetStateAction } from "react";

import Jumbotron from "~/components/ui/jumbotron";

export interface LeaderboardHeaderProps {
  teams:
    | {
        id: string;
        team: {
          id: string;
          name: string;
        };
      }[]
    | null
    | undefined;
  allTeams: { id: string }[] | null | undefined;
}

export function getLeaderboardHeaderContents({
  teams,
  allTeams,
  setDimensions: setMaxHeight,
}: LeaderboardHeaderProps & {
  setDimensions: Dispatch<
    SetStateAction<{
      width: number;
      height: number;
    }>
  >;
}) {
  return (
    teams?.map(({ id: membershipId, team: { id: teamId, name } }) => {
      const rank = allTeams?.findIndex(({ id }) => id === teamId);

      return (
        <Jumbotron
          key={membershipId}
          geometric="white"
          title={name}
          subTitle={
            rank == null
              ? undefined
              : `Team Spirit Point Ranking: ${ordinalString(rank + 1)}`
          }
          bodyText="Click here to go to your Team Dashboard!"
          onLayout={({ nativeEvent: { layout } }) => {
            setMaxHeight({
              width: layout.width,
              height: layout.height,
            });
          }}
          className="rounded"
        />
      );
    }) ?? []
  );
}
