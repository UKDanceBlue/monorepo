import { FontAwesome5 } from "@expo/vector-icons";
import firebaseFirestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { SpiritTeamsRootDoc } from "@ukdanceblue/db-app-common";
import { View } from "native-base";
import { Pressable } from "native-base/src/components/primitives";
import { useCallback, useEffect, useState } from "react";

import Jumbotron from "../../../../../common/components/Jumbotron";
import { universalCatch } from "../../../../../common/logging";
import { useAuthData, useUserData } from "../../../../../context";
import { StandingType } from "../../../../../types/StandingType";
import { SpiritStackScreenProps } from "../../../../../types/navigationTypes";

import Scoreboard from "./Scoreboard/Scoreboard";

function addOrdinal(num: number) {
  const j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) {
    return `${num }st`;
  }
  if (j === 2 && k !== 12) {
    return `${num }nd`;
  }
  if (j === 3 && k !== 13) {
    return `${num }rd`;
  }
  return `${num }th`;
}

/**
 * Wrapper for a Standings component
 */
const ScoreBoardScreen = () => {
  const {
    teamId: userTeamId, team
  } = useUserData();
  const [ userTeamRank, setUserTeamRank ] = useState<number | undefined>(undefined);
  const dbRole = useAuthData().authClaims?.dbRole ?? "public";
  // const moraleTeamName = useAppSelector((state) => state);
  const [ standingData, setStandingData ] = useState<StandingType[]>([]);
  const [ loading, setLoading ] = useState(true);
  const { navigate } = useNavigation<SpiritStackScreenProps<"Scoreboard">["navigation"]>();

  const refresh = useCallback(() => {
    setLoading(true);
    // switch (pointType) {
    // case "spirit":
    firebaseFirestore().doc("spirit/teams").get()
      .then((querySnapshot) => {
        const rootTeamDataJson = querySnapshot.data() as unknown;
        if (!SpiritTeamsRootDoc.isSpiritTeamsRootDocJson(rootTeamDataJson)) {
          throw new Error("Invalid data type");
        } else {
          const rootTeamData = SpiritTeamsRootDoc.fromJson(rootTeamDataJson);
          const tmpStandingData: StandingType[] = Object.entries(rootTeamData.basicInfo)
            .filter(([ ,{ teamClass } ]) => teamClass === "committee" ? dbRole === "committee" : true)
            .map(([ teamId, teamData ]) => {
              return {
                id: teamId,
                highlighted: teamId === userTeamId,
                name: teamData.name,
                points: teamData.totalPoints ?? 0
              };
            })
            .sort((a, b) => b.points - a.points);
          setUserTeamRank(tmpStandingData.findIndex((team) => team.id === userTeamId) + 1);
          setStandingData(
            tmpStandingData
          );
        }
      })
      .catch(universalCatch)
      .finally(() => setLoading(false));
    // break;

    // case "morale":
    //   firebaseFirestore().collection("marathon/2022/morale-teams").get()
    //     .then(
    //       (querySnapshot) => {
    //         const tempStandingData: StandingType[] = [];
    //         querySnapshot.forEach((document) => {
    //           const teamData = document.data() as FirestoreMoraleTeam;
    //           tempStandingData.push({
    //             id: document.id,
    //             name: `Team #${teamData.teamNumber}:\n${teamData.leaders}`,
    //             points: teamData.points,
    //             highlighted: false // moraleTeamId === teamData.teamNumber,
    //           });
    //         });
    //         setStandingData(tempStandingData);
    //       }
    //     )
    //     .catch(universalCatch);
    //   break;

    // case undefined:
    //   setStandingData([]);
    //   break;

    // default:
    //   showMessage("Failed to load valid point type configuration");
    //   break;
    // }
  }, [ dbRole, userTeamId ]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <View flex={1}>
      {
        team == null
          ? (<Jumbotron
            title="You are not part of a team"
            subTitle=""
            bodyText="If you believe this is an error and you have submitted your spirit points, please contact your team captain or the DanceBlue committee."
            icon="users"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            iconType={FontAwesome5}
            iconColor="blue.500"
          />)
          : (
            <Pressable
              onPress={() => {
                navigate("MyTeam");
              }}
              _pressed={{ opacity: 0.5 }}
            >
              <Jumbotron
                title={team.name}
                subTitle={userTeamRank == null ? undefined : `Team Spirit Point Ranking: ${addOrdinal(userTeamRank)}`}
                bodyText="Click here to go to your Team Dashboard!"
                icon="users"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                iconType={FontAwesome5}
                iconColor="secondary.100"
                iconSize={40}
              />
            </Pressable>
          )
      }
      <Scoreboard
        title="Spirit Points"
        data={standingData}
        refreshing={loading}
        onRefresh={refresh}/>
    </View>
  );
};

export default ScoreBoardScreen;
