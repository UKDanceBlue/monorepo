import Scoreboard from "./Scoreboard/Scoreboard";

import Jumbotron from "@common/components/Jumbotron";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-mobile";
import {
  Box,
  CheckIcon,
  HStack,
  Select,
  Text,
  View,
  Pressable,
} from "native-base";
import { useEffect, useMemo, useState } from "react";

import type { StandingType } from "../../../../../types/StandingType";
import type { SpiritStackScreenProps } from "../../../../../types/navigationTypes";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-mobile";


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

const ScoreBoardFragment = graphql(/* GraphQL */ `
  fragment ScoreBoardFragment on TeamNode {
    id
    name
    totalPoints
    legacyStatus
    type
  }
`);

const HighlightedTeamFragment = graphql(/* GraphQL */ `
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
  highlightedTeamFragment: FragmentType<typeof HighlightedTeamFragment> | null;
  scoreBoardFragment: readonly FragmentType<typeof ScoreBoardFragment>[] | null;
  loading: boolean;
  refresh: () => void;
  mode?: "spirit" | "morale";
}) => {
  const [filter, setFilter] = useState<string>("all");
  const [userTeamRank, setUserTeamRank] = useState<number | undefined>(
    undefined
  );
  // const moraleTeamName = useAppSelector((state) => state);
  const [standingData, setStandingData] = useState<StandingType[]>([]);
  const { navigate } =
    useNavigation<SpiritStackScreenProps<"Scoreboard">["navigation"]>();

  const teamsData = getFragmentData(ScoreBoardFragment, scoreBoardFragment);
  const userTeamData = getFragmentData(
    HighlightedTeamFragment,
    highlightedTeamFragment
  );

  // Update filteredData based on the selected filter
  const filteredData = useMemo(
    () =>
      teamsData?.filter((team) => {
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
      }) ?? [],
    [teamsData, filter]
  );

  useEffect(() => {
    // Determine the standings based on filteredData
    const newStandingData: StandingType[] = [];
    for (const team of filteredData) {
      newStandingData.push({
        name: team.name,
        id: team.id,
        points: team.totalPoints,
        highlighted: team.id === userTeamData?.id,
      });
      if (team.id === userTeamData?.id) {
        setUserTeamRank(newStandingData.length);
      }
    }

    setStandingData(newStandingData);
  }, [teamsData, userTeamData, filter, filteredData]);

  return (
    <View flex={1}>
      {mode === "spirit" ? (
        userTeamData?.id == null ? (
          <Jumbotron
            title="You are not part of a team"
            subTitle=""
            bodyText="If you believe this is an error and you have submitted your spirit points, please contact your team captain or the DanceBlue committee."
            icon="users"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            iconType={FontAwesome5}
            iconColor="blue.500"
          />
        ) : (
          <Pressable
            onPress={() => {
              navigate("MyTeam");
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
              <Select.Item label="Committee" value="committee" />
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
        onTeamClick={userTeamData?.id ? () => navigate("MyTeam") : undefined}
      />
    </View>
  );
};

export default ScoreBoardScreen;
