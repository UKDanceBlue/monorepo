import { FontAwesome5 } from "@expo/vector-icons";
import { MembershipPositionType } from "@ukdanceblue/common";
import { Center, Text } from "native-base";
import { useWindowDimensions } from "react-native";

import type { StandingType } from "@/common-types/StandingType";
import { type FragmentOf, graphql, readFragment } from "@/graphql/index";

import TeamInformation from "./TeamInformation";

export const MyTeamFragment = graphql(/* GraphQL */ `
  fragment MyTeamFragment on TeamNode {
    id
    name
    totalPoints
    fundraisingTotalAmount
    members {
      id
      position
      person {
        id
        text
      }
      points
    }
  }
`);

const TeamScreen = ({
  myTeamFragment,
  userUuid,
  showFundraisingButton,
}: {
  myTeamFragment: FragmentOf<typeof MyTeamFragment> | null;
  userUuid: string;
  loading: boolean;
  refresh: () => void;
  showFundraisingButton: boolean;
}) => {
  const { width: screenWidth } = useWindowDimensions();

  const team = readFragment(MyTeamFragment, myTeamFragment);

  const teamStandings: StandingType[] = [];
  for (const member of team?.members ?? []) {
    teamStandings.push({
      id: member.person.id,
      name: member.person.text,
      highlighted: member.person.id === userUuid,
      points: member.points,
    });
  }
  teamStandings.sort((a, b) => b.points - a.points);

  if (team == null) {
    return (
      <Center>
        <FontAwesome5
          name="users"
          size={screenWidth / 3}
          color={"#cc1100"}
          style={{ textAlignVertical: "center" }}
        />
        <Text fontSize={25} mx="8" m="4" textAlign="center">
          You are not on a team.
        </Text>
        <Text mx="8" m="4" textAlign="center">
          If you believe this is an error and have submitted spirit points, try
          logging out and logging back in. If that doesn&apos;t work, don&apos;t
          worry, your spirit points are being recorded, please contact your team
          captain or the DanceBlue committee to get access in the app.
        </Text>
      </Center>
    );
  } else {
    const { name, totalPoints, members } = team;

    return (
      <TeamInformation
        showFundraisingButton={showFundraisingButton}
        captains={members
          ?.filter(
            (member) =>
              member.position === MembershipPositionType.Captain &&
              member.person.text
          )
          .map((captain) => captain.person.text)}
        name={name}
        scoreboardData={teamStandings}
        teamTotal={totalPoints}
      />
    );
  }
};

export default TeamScreen;
