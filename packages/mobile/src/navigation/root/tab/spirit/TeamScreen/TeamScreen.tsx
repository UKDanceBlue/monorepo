import { FontAwesome5 } from "@expo/vector-icons";
import { MembershipPositionType } from "@ukdanceblue/common";
import { Center, Text } from "native-base";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

import type { StandingType } from "@/common-types/StandingType";
import type { FragmentType } from "@/graphql/index";
import { getFragmentData, graphql } from "@/graphql/index";

import TeamInformation from "./TeamInformation";

export const MyTeamFragment = graphql(/* GraphQL */ `
  fragment MyTeamFragment on TeamNode {
    id
    name
    totalPoints
    fundraisingTotalAmount
    pointEntries {
      personFrom {
        id
        name
        linkblue
      }
      points
    }
    members {
      position
      person {
        linkblue
        name
      }
    }
  }
`);

export const MyFundraisingFragment = graphql(/* GraphQL */ `
  fragment MyFundraisingFragment on PersonNode {
    fundraisingTotalAmount
    fundraisingAssignments {
      amount
      entry {
        donatedToText
        donatedByText
        donatedOn
      }
    }
  }
`);

const TeamScreen = ({
  myTeamFragment,
  myFundraisingFragment,
  userUuid,
  loading: _loading,
  refresh: _refresh,
}: {
  myTeamFragment: FragmentType<typeof MyTeamFragment> | null;
  myFundraisingFragment: FragmentType<typeof MyFundraisingFragment> | null;
  userUuid: string;
  loading: boolean;
  refresh: () => void;
}) => {
  const team = getFragmentData(MyTeamFragment, myTeamFragment);
  const fundraising = getFragmentData(
    MyFundraisingFragment,
    myFundraisingFragment
  );

  const [teamStandings, setTeamStandings] = useState<StandingType[]>([]);

  useEffect(() => {
    if (team?.pointEntries == null) {
      setTeamStandings([]);
      return;
    } else {
      const entriesRecord = new Map<string, StandingType>();
      for (const entry of team.pointEntries) {
        const { personFrom, points } = entry;
        const { id: uuid, name, linkblue } = personFrom ?? {};
        if (uuid) {
          const existing = entriesRecord.get(uuid);
          if (existing == null) {
            entriesRecord.set(uuid, {
              id: uuid,
              name: name ?? linkblue ?? "Unknown",
              highlighted: uuid === userUuid,
              points,
            });
          } else {
            existing.points += points;
          }
        } else {
          const existing = entriesRecord.get("%TEAM%");
          if (existing == null) {
            entriesRecord.set("%TEAM%", {
              id: "%TEAM%",
              name: "Team",
              highlighted: false,
              points,
            });
          } else {
            existing.points += points;
          }
        }
      }
      setTeamStandings(
        [...entriesRecord.values()].sort((a, b) => b.points - a.points)
      );
    }
  }, [team?.pointEntries, userUuid]);

  const { width: screenWidth } = useWindowDimensions();

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
        captains={members
          .filter(
            (member) =>
              member.position === MembershipPositionType.Captain &&
              (member.person.name ?? member.person.linkblue)
          )
          .map(
            (captain) =>
              captain.person.name ?? captain.person.linkblue ?? "Unknown"
          )}
        members={members
          .filter(
            (member) =>
              member.position === MembershipPositionType.Member &&
              (member.person.name ?? member.person.linkblue)
          )
          .map(
            (member) =>
              member.person.name ?? member.person.linkblue ?? "Unknown"
          )}
        name={name}
        scoreboardData={teamStandings}
        teamTotal={totalPoints}
        teamFundraisingTotal={fundraising?.fundraisingTotalAmount ?? 0}
        myFundraisingEntries={fundraising?.fundraisingAssignments ?? []}
      />
    );
  }
};

export default TeamScreen;
