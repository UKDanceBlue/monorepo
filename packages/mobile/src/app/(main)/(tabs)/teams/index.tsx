import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { Link, useRouter } from "expo-router";
import { FlatList, RefreshControl, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useQuery } from "urql";

import { graphql } from "~/api";
import { useActiveMarathon } from "~/api/hooks/useActiveMarathon";
import { LeaderboardHeader } from "~/components/teams/LeaderboardHeader/index";
import Place from "~/components/teams/Place";
import { Button } from "~/components/ui/button";
import Jumbotron from "~/components/ui/jumbotron";
import { useAuthorizationRequirement } from "~/lib/hooks/useLoginState";

export default function Teams() {
  const [teamsQuery, refreshTeams] = useQuery({
    query: graphql(/* GraphQL */ `
      query Teams(
        $type: [String!]!
        $legacyStatus: [String!]!
        $marathonYear: String!
      ) {
        teams(
          sendAll: true
          sortBy: { direction: desc, field: totalPoints }
          filters: {
            operator: AND
            filters: [
              {
                field: type
                filter: { arrayStringFilter: { value: $type, comparison: IN } }
              }
              {
                field: legacyStatus
                filter: {
                  arrayStringFilter: { value: $legacyStatus, comparison: IN }
                }
              }
              {
                field: marathonYear
                filter: {
                  singleStringFilter: {
                    value: $marathonYear
                    comparison: EQUALS
                  }
                }
              }
            ]
          }
        ) {
          data {
            id
            name
            totalPoints
          }
        }
        me {
          teams {
            id
            team {
              id
              name
            }
          }
        }
      }
    `),
    variables: {
      type: [TeamType.Spirit] satisfies TeamType[],
      legacyStatus: [TeamLegacyStatus.NewTeam, TeamLegacyStatus.ReturningTeam],
      marathonYear: useActiveMarathon()[0]?.year ?? "",
    },
  });

  const { push } = useRouter();

  const canGetAllTeams = useAuthorizationRequirement("get", "TeamNode");

  const myTeams =
    teamsQuery.data?.me?.teams?.filter(({ team: { id } }) =>
      teamsQuery.data?.teams?.data.some(({ id: teamId }) => teamId === id)
    ) ?? [];

  return (
    <View className="flex flex-1 flex-col">
      {myTeams.length === 0 ? (
        <View className="flex-0">
          <Jumbotron
            geometric="white"
            title="You are not a member of a team"
            bodyText="If you believe this is an error and you have submitted your spirit points, please contact your team captain or the DanceBlue committee."
          />
        </View>
      ) : (
        <>
          <View className="flex-0">
            <LeaderboardHeader
              teams={myTeams}
              allTeams={teamsQuery.data?.teams?.data}
              onPress={(teamId) => {
                push(`/teams/${teamId}`);
              }}
            />
          </View>
          <View className="flex flex-0 p-4">
            <Link asChild href="/teams/fundraising">
              <Button>See Your Fundraising</Button>
            </Link>
          </View>
        </>
      )}
      <View className="flex flex-1">
        <FlatList
          refreshing={teamsQuery.fetching}
          refreshControl={
            <RefreshControl
              refreshing={teamsQuery.fetching}
              onRefresh={refreshTeams}
            />
          }
          data={teamsQuery.data?.teams?.data}
          keyExtractor={({ id }) => id}
          renderItem={(info) => {
            const rank = info.index + 1;
            const { name, totalPoints, id } = info.item;
            const isUserTeam =
              teamsQuery.data?.me?.teams?.some(({ team }) => team.id === id) ??
              false;
            const child = (
              <Place
                name={name}
                points={totalPoints}
                lastRow={rank === teamsQuery.data?.teams?.data.length}
                rank={rank}
                isHighlighted={isUserTeam}
              />
            );

            return isUserTeam || canGetAllTeams ? (
              <TouchableOpacity onPress={() => push(`/teams/${id}`)}>
                {child}
              </TouchableOpacity>
            ) : (
              child
            );
          }}
        />
      </View>
    </View>
  );
}
