import { TeamType } from "@ukdanceblue/common";
import { FlatList, RefreshControl } from "react-native";
import { useQuery } from "urql";

import { graphql } from "~/api";
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

  console.log(teamsQuery);

  return (
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
        const { name, totalPoints } = info.item;
        return (
          <Place
            name={name}
            points={totalPoints}
            lastRow={rank === teamsQuery.data?.teams?.data.length}
            rank={rank}
            isHighlighted={false}
          />
        );
      }}
    />
  );
}
