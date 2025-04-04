import { TeamType } from "@ukdanceblue/common";
import { FlatList, RefreshControl, View } from "react-native";
import { useQuery } from "urql";

import { graphql } from "~/api";
import { LeaderboardHeader } from "~/components/teams/LeaderboardHeader/index";
import Place from "~/components/teams/Place";

export default function Teams() {
  const [teamsQuery, refreshTeams] = useQuery({
    query: graphql(/* GraphQL */ `
      query Teams($type: [String!]!) {
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
            ]
          }
        ) {
          data {
            id
            name
            totalPoints
          }
        }
      }
    `),
    variables: {
      type: [TeamType.Spirit] satisfies TeamType[],
    },
  });

  const [myTeamsQuery, refreshMyTeams] = useQuery({
    query: graphql(/* GraphQL */ `
      query MyTeams {
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
  });

  return (
    <View className="flex flex-1 flex-col">
      <LeaderboardHeader
        teams={myTeamsQuery.data?.me?.teams}
        allTeams={teamsQuery.data?.teams?.data}
      />
      <FlatList
        refreshing={teamsQuery.fetching || myTeamsQuery.fetching}
        refreshControl={
          <RefreshControl
            refreshing={teamsQuery.fetching || myTeamsQuery.fetching}
            onRefresh={() => {
              refreshTeams();
              refreshMyTeams();
            }}
          />
        }
        data={teamsQuery.data?.teams?.data}
        keyExtractor={({ id }) => id}
        renderItem={(info) => {
          const rank = info.index + 1;
          const { name, totalPoints, id } = info.item;
          return (
            <Place
              name={name}
              points={totalPoints}
              lastRow={rank === teamsQuery.data?.teams?.data.length}
              rank={rank}
              isHighlighted={
                myTeamsQuery.data?.me?.teams?.some(
                  ({ team }) => team.id === id
                ) ?? false
              }
            />
          );
        }}
      />
    </View>
  );
}
