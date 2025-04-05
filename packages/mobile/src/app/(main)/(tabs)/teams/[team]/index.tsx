import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { useQuery } from "urql";

import { graphql } from "~/api";
import Place from "~/components/teams/Place";
import Jumbotron from "~/components/ui/jumbotron";
import { Text } from "~/components/ui/text";

export default function Team() {
  const { team } = useLocalSearchParams<{ team: string }>();

  const [{ data, fetching, error }, refresh] = useQuery({
    query: graphql(/* GraphQL */ `
      query Team($teamId: GlobalId!) {
        me {
          id
        }
        team(id: $teamId) {
          id
          name
          totalPoints
          members {
            id
            points
            position
            person {
              id
              text
            }
          }
        }
      }
    `),
    variables: {
      teamId: team,
    },
  });

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-1 flex-col">
      <Jumbotron
        geometric="white"
        title={data?.team?.name ?? "Team"}
        subTitle={`${data?.team?.totalPoints ?? "N/A"} Points`}
      />
      <FlatList
        refreshing={fetching}
        refreshControl={
          <RefreshControl refreshing={fetching} onRefresh={refresh} />
        }
        data={data?.team?.members ?? []}
        ListEmptyComponent={<Text>No members</Text>}
        keyExtractor={({ id }) => id}
        renderItem={(info) => {
          const rank = info.index + 1;
          const {
            id: membershipId,
            person: { id: personId, text: personText },
            points,
          } = info.item;
          const isUser = personId === data?.me?.id;
          return (
            <Place
              key={membershipId}
              name={personText}
              points={points}
              lastRow={rank === data?.team?.members?.length}
              rank={rank}
              isHighlighted={isUser}
            />
          );
        }}
      />
    </View>
  );
}
