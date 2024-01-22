import Jumbotron from "@common/components/Jumbotron";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import {Box, CheckIcon, HStack, Select, Text, View} from "native-base";
import { Pressable } from "native-base/src/components/primitives";
import { useEffect, useMemo, useState } from "react";

import type { StandingType } from "../../../../../types/StandingType";
import type { SpiritStackScreenProps } from "../../../../../types/navigationTypes";

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

const ScoreBoardFragment = graphql(/* GraphQL */ `
  fragment ScoreBoardFragment on TeamResource {
    uuid
    name
    totalPoints
    legacyStatus
    type
  }
`);

const HighlightedTeamFragment = graphql(/* GraphQL */ `
  fragment HighlightedTeamFragment on TeamResource {
    uuid
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
}: {
  highlightedTeamFragment: FragmentType<typeof HighlightedTeamFragment> | null;
  scoreBoardFragment: readonly FragmentType<typeof ScoreBoardFragment>[] | null;
  loading: boolean;
  refresh: () => void;
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
  const filteredData = useMemo(() =>
    teamsData?.filter((team) => {
      switch (filter) {
        case "dancers": {
          return team.type === TeamType.Spirit;
        }
        case "new": {
          return team.legacyStatus === TeamLegacyStatus.NewTeam;
        }
        case "returning": {
          return team.legacyStatus === TeamLegacyStatus.ReturningTeam;
        }
        case "committee": {
          return team.type === TeamType.Committee;
        }
        default: {
          return true;
        } // Show all teams for "All" filter
      }
  }) ?? [], [teamsData, filter]);

useEffect(() => {

    // Determine the standings based on filteredData
    const newStandingData: StandingType[] = [];
    for (const team of filteredData) {
      newStandingData.push({
        name: team.name,
        id: team.uuid,
        points: team.totalPoints,
        highlighted: team.uuid === userTeamData?.uuid,
      });
      if (team.uuid === userTeamData?.uuid) {
        setUserTeamRank(newStandingData.length);
      }
    }

    setStandingData(newStandingData);
  }, [teamsData, userTeamData, filter, filteredData]);

  return (
    <View flex={1}>
      {userTeamData?.uuid == null ? (
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
      )}

      <HStack space={2} justifyContent="center" justifyItems="center">
        <Box>
          <Text fontSize="xl">Filter Leaderboard:</Text>
        </Box>
        <Box>
          <Select selectedValue={filter} minWidth="200" accessibilityLabel="Filter" placeholder="Filter" _selectedItem={{
            endIcon: <CheckIcon size="5" />
          }} mt={1} onValueChange={itemValue => setFilter(itemValue)}>
            <Select.Item label="All" value="all"/>
            <Select.Item label="Dancer Teams" value="dancers"/>
            <Select.Item label="New Teams Only" value="new"/>
            <Select.Item label="Returning Teams Only" value="returning"/>
            <Select.Item label="Committee" value="committee"/>
          </Select>
        </Box>
      </HStack>

      <Scoreboard
        title="Spirit Points"
        data={standingData}
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

export default ScoreBoardScreen;
