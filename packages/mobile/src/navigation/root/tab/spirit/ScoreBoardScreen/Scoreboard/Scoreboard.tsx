import { Box, Text } from "native-base";
import { FlatList, RefreshControl } from "react-native";

import { useThemeColors } from "../../../../../../common/customHooks";
import { StandingType } from "../../../../../../types/StandingType";
import ScoreboardItem from "../ScoreboardItem";

const Scoreboard = ({
  title, data, onRefresh, refreshing
}: { title:string; data: StandingType[]; onRefresh?: () => void; refreshing?: boolean }) => {
  const textShadowColor = useThemeColors().secondary[300];

  return (
    <Box flex={1}>
      <Text
        justifyContent="center"
        alignContent="center"
        textAlign="center"
        color="secondary.400"
        fontFamily="heading"
        fontSize="4xl"
        flex={0}
        style={{
          textShadowColor,
          textShadowOffset: { width: 2, height: 1.5 },
          textShadowRadius: 1
        }}>{title}</Text>
      <FlatList
        data={data}
        onRefresh={onRefresh}
        refreshing={refreshing ?? false}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} /> : undefined}
        renderItem={({
          item, index
        }) => (
          <ScoreboardItem
            key={item.id}
            rank={index + 1}
            name={item.name}
            points={item.points}
            highlighted={item.highlighted}
          />
        )}
        ItemSeparatorComponent={() => (<Box
          marginLeft={3}
          marginRight={3}
          style={{ borderBottomWidth: 1, borderBottomColor: "#0032A0" }}/>)}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
      />
    </Box>
  );
};
export default Scoreboard;
