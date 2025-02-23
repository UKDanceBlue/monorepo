import { Linking } from "react-native";

import { Text } from "@/components/core/Text";
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
      bold
      h1
      style={{
        overflow: "visible",
      }}
    >
      DanceBlue
    </Text>
  );
}
