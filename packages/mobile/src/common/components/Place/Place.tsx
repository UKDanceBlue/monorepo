// Import third-party dependencies
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider, Heading, Text, View } from "native-base";
import { ReactElement } from "react";

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
    case 1:
      return <FontAwesome5 name="trophy" size={24} color="gold" />;
    case 2:
      return <FontAwesome5 name="award" size={30} color="silver" />;
    case 3:
      return <FontAwesome5 name="award" size={30} color="blue" />;
    default:
      return null;
    }
  };
  return (
    // Renders the individual row of the leaderboard for each target
    <View
      key={rank}
      style={{ width: "100%" }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "row", justifyContent: "flex-start", width: "20%" }}>
          <>
            <Text style={{ fontSize: 20, marginLeft: 10, marginRight: 10 }}>
              {/* Renders the rank/place of the target */}
              {rank}
            </Text>
            {top3Icon(rank)}
          </>
        </View>
        <Heading
          style={{
            color: isHighlighted ? "#00f" : undefined,
            alignSelf: "center",
            width: "60%",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          {name}
        </Heading>
        <Text
          style={{ textAlign: "right", color: isHighlighted ? "#00f" : undefined }}
        >
          {points}
          {points === 1 ? " point  " : " points  "}
        </Text>
      </View>
      {!lastRow && (<Divider />)}
    </View>
  );
};

export default Place;
