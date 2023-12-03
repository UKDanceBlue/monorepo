import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";
import { useEffect } from "react";
import { useQuery } from "urql";

import type { SpiritStackParamList } from "../../../../types/navigationTypes";

import ScoreboardScreen from "./ScoreBoardScreen";
import TeamScreen from "./TeamScreen";

const scoreBoardDocument = graphql(/* GraphQL */ `
  query ScoreBoardDocument {
    me {
      data {
        uuid
        teams {
          team {
            ...HighlightedTeamFragment
            ...MyTeamFragment
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

const SpiritStack = createNativeStackNavigator<SpiritStackParamList>();

const SpiritScreen = () => {
  const [query, refresh] = useQuery({
    query: scoreBoardDocument,
  });

  useEffect(() => {
    if (query.error) {
      console.error(
        query.error.message,
        query.error.graphQLErrors,
        query.error.networkError
      );
    }
  }, [query.error]);

  return (
    <SpiritStack.Navigator screenOptions={{ headerShown: false }}>
      <SpiritStack.Screen name="Scoreboard">
        {() => (
          <ScoreboardScreen
            highlightedTeamFragment={
              query.data?.me.data?.teams[0]?.team ?? null
            }
            scoreBoardFragment={query.data?.teams.data ?? null}
            loading={query.fetching}
            refresh={() => refresh({ requestPolicy: "network-only" })}
          />
        )}
      </SpiritStack.Screen>
      <SpiritStack.Screen name="MyTeam">
        {() => (
          <TeamScreen
            myTeamFragment={query.data?.me.data?.teams[0]?.team ?? null}
            userUuid={query.data?.me.data?.uuid ?? ""}
            loading={query.fetching}
            refresh={refresh}
          />
        )}
      </SpiritStack.Screen>
    </SpiritStack.Navigator>
  );
};

export default SpiritScreen;
