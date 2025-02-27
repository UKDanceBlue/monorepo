import { setStringAsync } from "expo-clipboard";
import { Button, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useLogMemory } from "@/common/logger/useLogMemory";

export function LogView() {
  const memory = useLogMemory();

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <ScrollView style={{ flex: 1 }}>
        {memory.map((log, index) => (
          <Text key={index} style={{ margin: 4 }}>
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
