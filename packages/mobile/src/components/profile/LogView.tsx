import { setStringAsync } from "expo-clipboard";
import { Button, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { LogLevel, logLevelToString } from "~/lib/logger/transport";
import { useLogMemory } from "~/lib/logger/useLogMemory";

export function LogView() {
  const memory = useLogMemory();

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <ScrollView style={{ flex: 1 }}>
        {memory.map(([level, log], index) => (
          <Text
            key={index}
            style={{ margin: 4, paddingBottom: 1, borderBottomWidth: 1 }}
          >
            <Text
              style={{
                color:
                  level === LogLevel.error
                    ? "red"
                    : level === LogLevel.warn
                      ? "orange"
                      : "black",
              }}
            >
              {logLevelToString(level)}
            </Text>
            {log}
          </Text>
        ))}
      </ScrollView>
      <Button
        onPress={() => {
          void setStringAsync(memory.join("\n"));
        }}
        title="Copy Logs"
      />
    </View>
  );
}
