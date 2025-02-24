import { Linking, Pressable } from "react-native";

import { H1 } from "~/components/ui/typography";
import { universalCatch } from "~/util/logger/Logger";

export function DBHeaderText() {
  return (
    <Pressable
      onPress={async () => {
        if (
          await Linking.canOpenURL("https://www.danceblue.org/").catch(
            universalCatch
          )
        ) {
          Linking.openURL("https://www.danceblue.org/").catch(universalCatch);
        }
      }}
    >
      <H1 className="font-bodoni-bold mx-2 color-primary">DanceBlue</H1>
    </Pressable>
  );
}
