import { TeamType } from "@ukdanceblue/common";
import { Text, View } from "native-base";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useQuery } from "urql";

import { SimpleConfigFragment } from "@/common/fragments/Configuration";
import { graphql, readFragment } from "@/graphql/index";

const stationNumberToName = (stationNumber: number) => {
  switch (stationNumber) {
    case 1: {
      return "Art";
    }
    case 2: {
      return "Sports";
    }
    case 3: {
      return "Entertainment";
    }
    case 4: {
      return "Science";
    }
    case 5: {
      return "History";
    }
    case 6: {
      return "Geography";
    }
    default: {
      return "Unknown";
    }
  }
};

export function TriviaCrack() {
  const [{ data }] = useQuery({
    query: graphql(
      /* GraphQL */ `
        query TriviaCrack {
          activeConfiguration(key: "TRIVIA_CRACK") {
            data {
              ...SimpleConfig
            }
          }

          me {
            teams {
              team {
                type
                name
              }
            }
          }
        }
      `,
      [SimpleConfigFragment]
    ),
  });

  const [spins, setSpins] = useState<number[] | null>(null);
  const option = readFragment(
    SimpleConfigFragment,
    data?.activeConfiguration.data
  );

  const { stationOrder, moraleTeamNumber } = useMemo(() => {
    const value = JSON.parse(option?.value || "{}") as unknown;
    let stationOrder: [number, number, number, number, number, number] | null =
      null;
    let moraleTeamNumber: number | undefined;
    if (typeof value === "object" && value !== null) {
      if ((data?.me?.teams.length ?? 0) > 0) {
        const moraleTeams =
          data?.me?.teams.filter(
            (team) => team.team.type === TeamType.Morale
          ) ?? [];
        if (moraleTeams[0]?.team.name.startsWith("Morale Team")) {
          const teamNumber = Number.parseInt(
            moraleTeams[0].team.name.split(" ")[2],
            10
          );
          if (!Number.isNaN(teamNumber)) {
            moraleTeamNumber = teamNumber;
          }
        }
      }

      if (moraleTeamNumber != null) {
        const moraleTeamNumberString = moraleTeamNumber.toString();
        if (moraleTeamNumberString in value) {
          const teamEntry = (value as Record<string, unknown>)[
            moraleTeamNumberString
          ];
          if (
            Array.isArray(teamEntry) &&
            teamEntry.length === 6 &&
            teamEntry.every((x) => typeof x === "number")
          ) {
            stationOrder = teamEntry as [
              number,
              number,
              number,
              number,
              number,
              number,
            ];
          }
        }
      }
    }
    return { stationOrder, moraleTeamNumber };
  }, [data?.me?.teams, option?.value]);

  useEffect(() => {
    if (stationOrder && spins == null) {
      setSpins(stationOrder);
    }
  }, [spins, stationOrder]);

  if (!data) {
    return <ActivityIndicator size="large" />;
  }

  if (!stationOrder) {
    return (
      <Text>
        Trivia Crack is not available for your team, or you have not been
        assigned to one.
      </Text>
    );
  }

  return (
    <View>
      <Text>Morale Team {moraleTeamNumber} Stations:</Text>
      {spins?.map((spin, index) => (
        <View key={index}>
          <Text>
            Rotation {index + 1}: {stationNumberToName(spin)}
          </Text>
        </View>
      ))}
    </View>
  );
}
