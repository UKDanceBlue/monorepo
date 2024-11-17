import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TeamType } from "@ukdanceblue/common";
import { useEffect, useState } from "react";
import { useQuery } from "urql";

import { Logger } from "@/common/logger/Logger";
import { showMessage } from "@/common/util/alertUtils";
import { graphql } from "@/graphql/index";

import type { SpiritStackParamList } from "../../../../types/navigationTypes";
import ScoreboardScreen from "./ScoreBoardScreen";
import TeamScreen from "./TeamScreen";

const scoreBoardDocument = graphql(/* GraphQL */ `
  query ScoreBoardDocument($type: TeamType!, $marathonId: GlobalId!) {
    me {
      id
      primaryTeam(teamType: $type) {
        team {
          ...HighlightedTeamFragment
          ...MyTeamFragment
        }
      }
      ...MyFundraisingFragment
    }
    teams(
      sendAll: true
      sortBy: ["totalPoints", "name"]
      sortDirection: [desc, asc]
      type: [$type]
      marathonId: [$marathonId]
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
    latestMarathon {
      id
    }
  }
`);

const SpiritStack = createNativeStackNavigator<SpiritStackParamList>();

const SpiritScreen = () => {
  const [spiritMode, setSpiritMode] = useState<undefined | "spirit" | "morale">(
    undefined
  );

  const [marathonQuery] = useQuery({
    query: currentMarathonDocument,
  });
  const [query, refresh] = useQuery({
    query: scoreBoardDocument,
    pause: !spiritMode || !marathonQuery.data?.latestMarathon,
    variables: {
      type:
        !spiritMode || spiritMode === "spirit"
          ? TeamType.Spirit
          : TeamType.Morale,
      marathonId: marathonQuery.data?.latestMarathon?.id ?? "",
    },
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
    if (marathonQuery.error) {
      Logger.error("Error with current marathon query", {
        error: marathonQuery.error,
        context: {
          graphqlErrors: marathonQuery.error.graphQLErrors,
          networkError: marathonQuery.error.networkError,
        },
        source: "SpiritScreen",
        tags: ["graphql"],
      });
      showMessage(
        "Could not tell if spirit or morale points should be shown, defaulting to spirit points"
      );
      setSpiritMode("spirit");
    } else if (marathonQuery.data) {
      setSpiritMode(marathonQuery.data.currentMarathon ? "morale" : "spirit");
    }
  }, [marathonQuery.data, marathonQuery.error]);

  return (
    <SpiritStack.Navigator screenOptions={{ headerShown: false }}>
      <SpiritStack.Screen name="Scoreboard">
        {() => (
          <ScoreboardScreen
            highlightedTeamFragment={query.data?.me?.primaryTeam?.team ?? null}
            scoreBoardFragment={query.data?.teams.data ?? null}
            loading={!spiritMode || query.fetching}
            refresh={() => refresh({ requestPolicy: "network-only" })}
            mode={spiritMode}
          />
        )}
      </SpiritStack.Screen>
      <SpiritStack.Screen name="MyTeam">
        {() => (
          <TeamScreen
            myTeamFragment={query.data?.me?.primaryTeam?.team ?? null}
            myFundraisingFragment={query.data?.me ?? null}
            userUuid={query.data?.me?.id ?? ""}
            loading={!spiritMode || query.fetching}
            refresh={refresh}
          />
        )}
      </SpiritStack.Screen>
    </SpiritStack.Navigator>
  );
};

export default SpiritScreen;
