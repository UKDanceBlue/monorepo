import { Logger } from "@common/logger/Logger";
import { showMessage } from "@common/util/alertUtils";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TeamType } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/dist/graphql-client-public";
import { useEffect, useState } from "react";
import { useQuery } from "urql";

import type { SpiritStackParamList } from "../../../../types/navigationTypes";

import ScoreboardScreen from "./ScoreBoardScreen";
import TeamScreen from "./TeamScreen";

const scoreBoardDocument = graphql(/* GraphQL */ `
  query ScoreBoardDocument($type: [TeamType!]) {
    me {
      id
      teams {
        team {
          ...HighlightedTeamFragment
          ...MyTeamFragment
        }
      }
    }
    teams(
      sendAll: true
      sortBy: ["totalPoints", "name"]
      sortDirection: [desc, asc]
      type: $type
    ) {
      data {
        ...ScoreBoardFragment
      }
    }
  }
`);

const currentMarathonDocument = graphql(/* GraphQL */ `
  query ActiveMarathonDocument {
    currentMarathon {
      id
    }
  }
`);

const SpiritStack = createNativeStackNavigator<SpiritStackParamList>();

const SpiritScreen = () => {
  const [spiritMode, setSpiritMode] = useState<undefined | "spirit" | "morale">(
    "morale"
  );
  const [query, refresh] = useQuery({
    query: scoreBoardDocument,
    variables: {
      type: !spiritMode
        ? []
        : spiritMode === "spirit"
          ? [TeamType.Spirit, TeamType.Committee]
          : [TeamType.Morale],
    },
  });
  const [currentMarathonQuery] = useQuery({
    query: currentMarathonDocument,
  });

  useEffect(() => {
    if (query.error) {
      Logger.error("Error with spirit/morale points query", {
        error: query.error,
        context: {
          graphqlErrors: query.error.graphQLErrors,
          networkError: query.error.networkError,
        },
        source: "SpiritScreen",
        tags: ["graphql"],
      });
      showMessage("Could not load scoreboard");
    }
  }, [query.error]);

  useEffect(() => {
    if (currentMarathonQuery.error) {
      Logger.error("Error with current marathon query", {
        error: currentMarathonQuery.error,
        context: {
          graphqlErrors: currentMarathonQuery.error.graphQLErrors,
          networkError: currentMarathonQuery.error.networkError,
        },
        source: "SpiritScreen",
        tags: ["graphql"],
      });
      showMessage(
        "Could not tell if spirit or morale points should be shown, defaulting to spirit points"
      );
      setSpiritMode("spirit");
    }
  }, [currentMarathonQuery.error]);

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
            mode={spiritMode}
          />
        )}
      </SpiritStack.Screen>
      <SpiritStack.Screen name="MyTeam">
        {() => (
          <TeamScreen
            myTeamFragment={query.data?.me.data?.teams[0]?.team ?? null}
            userUuid={query.data?.me.data?.id ?? ""}
            loading={query.fetching}
            refresh={refresh}
          />
        )}
      </SpiritStack.Screen>
    </SpiritStack.Navigator>
  );
};

export default SpiritScreen;
