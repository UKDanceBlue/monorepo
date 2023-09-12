import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SpiritStackParamList } from "../../../../types/navigationTypes";

import ScoreboardScreen from "./ScoreBoardScreen";
import TeamScreen from "./TeamScreen";

const SpiritStack = createNativeStackNavigator<SpiritStackParamList>();

const SpiritScreen = () => {
  return (
    <SpiritStack.Navigator screenOptions={{ headerShown: false }}>
      <SpiritStack.Screen name="Scoreboard" component={ScoreboardScreen} />
      <SpiritStack.Screen
        name="MyTeam"
        component={TeamScreen}
      />
    </SpiritStack.Navigator>
  );
};

export default SpiritScreen;
