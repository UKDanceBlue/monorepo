// Import third-party dependencies
import { FontAwesome5 } from "@expo/vector-icons";
import type { ReactElement } from "react";
import React from "react";
import { View } from "react-native";

import { Separator } from "../ui/separator";
import { Text } from "../ui/text";

/**
 * A row-based component showing a target name, their rank (if applicable), and their points
 */
const Place = ({
  isHighlighted,
  rank,
  name,
  points = 0,
  lastRow,
}: {
  isHighlighted: boolean;
  rank: number;
  name: string;
  points: number;
  lastRow: boolean;
}) => {
  // The 'top3Icon function adds an award icon to the top 3 targets
  const top3Icon = (rankForIcon: number): ReactElement | null => {
    switch (rankForIcon) {
      case 1: {
        return <FontAwesome5 name="trophy" size={24} color="gold" />;
      }
      case 2: {
        return <FontAwesome5 name="award" size={30} color="silver" />;
      }
      case 3: {
        return <FontAwesome5 name="award" size={30} color="blue" />;
      }
      default: {
        return null;
      }
    }
  };
  return (
    // Renders the individual row of the leaderboard for each target
    <View key={rank} className="w-full">
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: "20%",
            padding: 10,
          }}
        >
          {top3Icon(rank) ?? (
            <Text style={{ fontSize: 20, marginLeft: 10, marginRight: 10 }}>
              {/* Renders the rank/place of the target */}
              {rank}
            </Text>
          )}
        </View>
        <Text
          style={{
            color: isHighlighted ? "#00f" : undefined,
            alignSelf: "center",
            width: "60%",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            textAlign: "right",
            color: isHighlighted ? "#00f" : undefined,
          }}
        >
          {points}
          {points === 1 ? " point  " : " points  "}
        </Text>
      </View>
      {!lastRow && <Separator />}
    </View>
  );
};

export default Place;
