import Jumbotron from "@common/components/Jumbotron";
import { FontAwesome5 } from "@expo/vector-icons";
import {Box, CheckIcon, HStack, Pressable, View, Text} from "@gluestack-ui/themed-native-base";
import {
  ChevronDownIcon,
  Icon,
  Select,
  SelectBackdrop, SelectContent, SelectDragIndicator,
  SelectDragIndicatorWrapper, SelectIcon, SelectInput,
  SelectItem,
  SelectPortal, SelectTrigger
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { useEffect, useState } from "react";

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
    legacyStatus
    totalPoints
  }
`);

const HighlightedTeamFragment = graphql(/* GraphQL */ `
  fragment HighlightedTeamFragment on TeamResource {
    uuid
    name
    legacyStatus
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

  const [filter, setFilter] = useState("");

  useEffect(() => {
    const newStandingData: StandingType[] = [];
    if (teamsData) {
      for (const team of teamsData) {
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
    }
    setStandingData(newStandingData);
  }, [teamsData, userTeamData]);

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


      <Select>
        <SelectTrigger variant="outline" size="md" >
          <SelectInput placeholder="Select option" />
          <SelectIcon mr="$3">
            <Icon as={ChevronDownIcon} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop/>
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="UX Research" value="ux" />
            <SelectItem label="Web Development" value="web" />
            <SelectItem
              label="Cross Platform Development Process"
              value="Cross Platform Development Process"
            />
            <SelectItem
              label="UI Designing"
              value="ui"
              isDisabled={true}
            />
            <SelectItem
              label="Backend Development"
              value="backend"
            />
          </SelectContent>
        </SelectPortal>
      </Select>


      {/*
      <HStack space={2} justifyContent="center" justifyItems="center">
        <Box>
          <Text fontSize="xl">Filter Scoreboard:</Text>
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

      */}

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
