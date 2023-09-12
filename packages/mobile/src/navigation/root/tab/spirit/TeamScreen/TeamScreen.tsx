import { FontAwesome5 } from "@expo/vector-icons";
import { Center, Text } from "native-base";
import { useWindowDimensions } from "react-native";

import { useUserData } from "../../../../../context";

import TeamInformation from "./TeamInformation";

const TeamScreen = () => {
  const {
    team, linkblue: userLinkblue
  } = useUserData();
  const { width: screenWidth } = useWindowDimensions();

  if (team == null) {
    return (
      <Center>
        <FontAwesome5
          name="users"
          size={screenWidth/3}
          color={"#cc1100"}
          style={{ textAlignVertical: "center" }}
        />
        <Text
          fontSize={25}
          mx="8"
          m="4"
          textAlign="center">
          You are not on a team.
        </Text>
        <Text mx="8" m="4" textAlign="center">
          If you believe this is an error and have submitted spirit points, try logging out and logging back in. If that doesn&apos;t work, don&apos;t worry, your spirit points are being recorded, please contact your team captain or the DanceBlue committee to get access in the app.
        </Text>
      </Center>
    );
  } else {
    const {
      name, memberNames, individualTotals, captains
    } = team;

    return (
      <TeamInformation
        // TODO ADD CAPTAINS
        captains={captains.map((linkblue) => memberNames[linkblue]).filter((name): name is string => name != null)}
        members={Object.values(memberNames).filter((name): name is string => name != null)}
        name={name}
        scoreboardData={individualTotals == null ? [] : Object.entries(individualTotals).filter(([linkblue]) => linkblue !== "%TEAM%").map(([ linkblue, points ]) => {
          return {
            id: linkblue,
            highlighted: linkblue === userLinkblue,
            name: memberNames[linkblue] ?? linkblue,
            points
          };
        })
          .sort((a, b) => b.points - a.points)}
        teamTotal={team.totalPoints == null ? 0 : team.totalPoints}
      />
    );
  }
};

export default TeamScreen;
