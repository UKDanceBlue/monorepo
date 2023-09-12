import { Text, View } from "native-base";
import { ReactElement, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

import { StandingType } from "../../../types/StandingType";
import Place from "../Place";

/**
 * Standings implementation for the a generic leaderboard
 */
const Standings = ({
  standingData,
  expandable = false,
  startExpanded = false,
  collapsedRows = 3,
}: {
  titleText: string;
  standingData: StandingType[];
  expandable?: boolean;
  startExpanded?: boolean;
  showTrophies?: boolean;
  collapsedRows?: number;
  dadJokeTempMagicCallback?: (arg0: boolean, arg1: string) => unknown;
}) => {
  const [ rows, setRows ] = useState<ReactElement[]>([]);
  const [ expanded, setExpanded ] = useState<boolean>(!!startExpanded);
  const [ rowsToShow, setRowsToShow ] = useState<number>(collapsedRows);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  useEffect(
    () => setRowsToShow(expanded ? standingData.length : collapsedRows),
    [
      expanded, standingData, collapsedRows
    ]
  );

  useEffect(() => {
    setIsLoading(true);
    const sortedStandings = standingData.map((standing) => ({
      ...standing,
      points: standing.points || 0,
    }));
    sortedStandings.sort((a, b) => {
      if (b.points === a.points) {
        if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      } else {
        return b.points - a.points;
      }
    });
    const tempRows = [];
    for (let i = 0; i < sortedStandings.length && i < rowsToShow; i++) {
      tempRows.push(
        <Place
          key={sortedStandings[i].id}
          rank={i + 1}
          name={sortedStandings[i].name}
          points={sortedStandings[i].points}
          isHighlighted={sortedStandings[i].highlighted}
          lastRow={i === sortedStandings.length - 1 && i === rowsToShow - 1}
        />
      );
    }
    setRows(tempRows);
    setIsLoading(false);
  }, [ standingData, rowsToShow ]);

  return (
    <View>
      <View style={localStyles.ListView}>
        {!isLoading && (
          <>
            {rows}
            {expandable &&
              (expanded ? (
                <TouchableOpacity onPress={() => setExpanded(false)}>
                  <Text>Show less...</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setExpanded(true)}>
                  <Text>Show more...</Text>
                </TouchableOpacity>
              ))}
          </>
        )}
      </View>
      {isLoading && (
        <ActivityIndicator
          size="large"

          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  ListView: {
    alignItems: "flex-start",
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
    paddingBottom: 5,
    paddingLeft: 5,
    paddingTop: 5,
  },
});

export default Standings;
