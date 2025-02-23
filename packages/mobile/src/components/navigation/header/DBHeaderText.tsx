import { Linking, Text } from "react-native";

import { universalCatch } from "@/util/logger/Logger";

export function DBHeaderText() {
  return (
    <Text
      onPress={async () => {
        if (
          await Linking.canOpenURL("https://www.danceblue.org/").catch(
            universalCatch
          )
        ) {
          Linking.openURL("https://www.danceblue.org/").catch(universalCatch);
        }
      }}
      // bold
      // h1
      style={{
        overflow: "visible",
      }}
    >
      DanceBlue
    </Text>
  );
}
