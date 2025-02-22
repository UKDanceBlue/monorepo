import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import {
  Box,
  CheckIcon,
  HStack,
  Pressable,
  Select,
  Text,
  View,
} from "native-base";
import { useMemo, useState } from "react";

import Jumbotron from "@/common/components/Jumbotron";
import type { FragmentOf } from "@/graphql/index";
import { graphql, readFragment } from "@/graphql/index";

import type { SpiritStackScreenProps } from "../../../../../types/navigationTypes";
import type { StandingType } from "../../../../../types/StandingType";
import Scoreboard from "./Scoreboard/Scoreboard";

function addOrdinal(num: number) {
  const j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) {
    return `${num}st`;
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`;
  }
  return `${num}th`;
}

export const ScoreBoardFragment = graphql(/* GraphQL */ `
  fragment ScoreBoardFragment on TeamNode {
    id
    name
    totalPoints
    legacyStatus
    type
  }
`);

export const HighlightedTeamFragment = graphql(/* GraphQL */ `
  fragment HighlightedTeamFragment on TeamNode {
    id
    name
    legacyStatus
    type
  }
`);

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = ({
  highlightedTeamFragment,
  scoreBoardFragment,
  loading,
  refresh,
  mode,
}: {
  highlightedTeamFragment: FragmentOf<typeof HighlightedTeamFragment> | null;
  scoreBoardFragment: readonly FragmentOf<typeof ScoreBoardFragment>[] | null;
  loading: boolean;
  refresh: () => void;
  mode?: "spirit" | "morale";
}) => {
  const [filter, setFilter] = useState<string>("all");
  const { navigate } =
    useNavigation<SpiritStackScreenProps<"Scoreboard">["navigation"]>();

  const teamsData = readFragment(ScoreBoardFragment, scoreBoardFragment ?? []);
  const userTeamData = readFragment(
    HighlightedTeamFragment,
    highlightedTeamFragment
  );

  // Update filteredData based on the selected filter
  const filteredData = useMemo(
    () =>
      teamsData.filter((team) => {
        const teamType: TeamType = team.type;
        const teamLegacyStatus: TeamLegacyStatus = team.legacyStatus;
        switch (filter) {
          case "dancers": {
            return teamType === TeamType.Spirit;
          }
          case "new": {
            return teamLegacyStatus === TeamLegacyStatus.NewTeam;
          }
          case "returning": {
            return teamLegacyStatus === TeamLegacyStatus.ReturningTeam;
          }
          // case "committee": {
          //   return teamType === TeamType.Committee;
          // }
          default: {
            return true;
          } // Show all teams for "All" filter
        }
      }),
    [teamsData, filter]
  );

  // Determine the standings based on filteredData
  const standingData: StandingType[] = [];
  let userTeamRank: number | undefined = undefined;
  for (const team of filteredData) {
    standingData.push({
      name: team.name,
      id: team.id,
      points: team.totalPoints,
      highlighted: team.id === userTeamData?.id,
    });
    if (team.id === userTeamData?.id) {
      userTeamRank = standingData.length;
    }
  }

  return (
    <View flex={1}>
      {mode === "spirit" ? (
        userTeamData?.id == null ? (
          <Jumbotron
            title="You are not part of a team"
            subTitle=""
            bodyText="If you believe this is an error and you have submitted your spirit points, please contact your team captain or the DanceBlue committee."
            icon="users"
            iconType={FontAwesome5}
            iconColor="blue.500"
          />
        ) : (
          <Pressable
            onPress={() => {
              navigate("MyTeam", {});
            }}
            _pressed={{ opacity: 0.5 }}
          >
            <Jumbotron
              title={userTeamData.name}
              subTitle={
                userTeamRank == null
                  ? undefined
                  : `Team Spirit Point Ranking: ${addOrdinal(userTeamRank)}`
              }
              bodyText="Click here to go to your Team Dashboard!"
              icon="users"
              iconType={FontAwesome5}
              iconColor="secondary.100"
              iconSize={40}
            />
          </Pressable>
        )
      ) : null}

      {mode === "spirit" && (
        <HStack space={2} justifyContent="center" justifyItems="center">
          <Box>
            <Text fontSize="xl">Filter Leaderboard:</Text>
          </Box>
          <Box>
            <Select
              selectedValue={filter}
              minWidth="200"
              accessibilityLabel="Filter"
              placeholder="Filter"
              _selectedItem={{
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) => setFilter(itemValue)}
            >
              <Select.Item label="All" value="all" />
              <Select.Item label="Dancer Teams" value="dancers" />
              <Select.Item label="New Teams Only" value="new" />
              <Select.Item label="Returning Teams Only" value="returning" />
              {/* <Select.Item label="Committee" value="committee" /> */}
            </Select>
          </Box>
        </HStack>
      )}

      <Scoreboard
        title={`${
          !mode ? "" : mode === "spirit" ? "Spirit " : "Morale "
        }Points`}
        data={standingData}
        refreshing={loading}
        onRefresh={refresh}
        onTeamClick={
          userTeamData?.id ? () => navigate("MyTeam", {}) : undefined
        }
      />
    </View>
  );
};

export default ScoreBoardScreen;
