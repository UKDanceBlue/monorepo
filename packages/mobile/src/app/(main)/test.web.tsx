import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useColors } from "@/theme/color-mode";
// import { useSetColorMode } from "@/theme/color-mode";

export default function Test() {
  const colors = useColors();

  const colorPairs = Object.entries(colors).filter(
    ([name]) => name !== "platform"
  );

  const components: ReactNode[] = [];

  for (const [name1, value1] of colorPairs) {
    for (const [name2, value2] of colorPairs) {
      if (name1 === name2) {
        continue;
      }
      components.push(
        <View
          key={`${name1}-${name2}`}
          style={{
            backgroundColor: value1,
            padding: 8,
            margin: 4,
            borderWidth: 8,
            borderColor: value2,
            width: "fit-content",
          }}
        >
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Text style={{ color: value2 }}>{name2}</Text>
            <Text style={{ color: value2 }} /*bold*/>on</Text>
            <Text style={{ color: value2 }} /*italic*/>{name1}</Text>
          </View>
        </View>
      );
    }
  }

  return (
    <ScrollView>
      <select
        onChange={() => {
          // setColorMode((event.target.value as "" | "dark" | "light") || null);
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="">System</option>
      </select>
      <details>
        <summary>Color pairs</summary>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {components}
        </View>
      </details>
    </ScrollView>
  );
}
