import Jumbotron from "@common/components/Jumbotron";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { View } from "native-base";
import { Pressable } from "native-base/src/components/primitives";
import { useEffect, useState } from "react";
import { useQuery } from "urql";

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
  }
`);

const scoreBoardDocument = graphql(/* GraphQL */ `
  query ScoreBoardDocument {
    me {
      data {
        teams {
          team {
            name
            uuid
          }
        }
      }
    }
    teams(
      sendAll: true
      sortBy: ["totalPoints", "name"]
      sortDirection: [DESCENDING, ASCENDING]
    ) {
      data {
        ...ScoreBoardFragment
      }
    }
  }
`);

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const [userTeamRank, setUserTeamRank] = useState<number | undefined>(
    undefined
  );
  // const moraleTeamName = useAppSelector((state) => state);
  const [standingData, setStandingData] = useState<StandingType[]>([]);
  const { navigate } =
    useNavigation<SpiritStackScreenProps<"Scoreboard">["navigation"]>();

  const [{ data: scoreBoardData, fetching: loading, error }, refresh] =
    useQuery({
      query: scoreBoardDocument,
    });
  const teamFragmentData = getFragmentData(
    ScoreBoardFragment,
    scoreBoardData?.teams.data ?? null
  );
  const userTeamName = scoreBoardData?.me.data?.teams[0]?.team.name;
  const userTeamUuid = scoreBoardData?.me.data?.teams[0]?.team.uuid;

  useEffect(() => {
    const newStandingData: StandingType[] = [];
    if (teamFragmentData) {
      for (const team of teamFragmentData) {
        newStandingData.push({
          name: team.name,
          id: team.uuid,
          points: team.totalPoints,
          highlighted: team.uuid === userTeamUuid,
        });
        if (team.uuid === userTeamUuid) {
          setUserTeamRank(newStandingData.length);
        }
      }
    }
    setStandingData(newStandingData);
  }, [userTeamUuid, teamFragmentData]);

  useEffect(() => {
    if (error != null) {
      console.error(error);
    }
  }, [error]);

  return (
    <View flex={1}>
      {userTeamUuid == null ? (
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
            title={userTeamName}
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
