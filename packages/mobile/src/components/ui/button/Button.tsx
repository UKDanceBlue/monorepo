import type { ReactNode } from "react";
import { Text } from "react-native";
import { ActivityIndicator, View } from "react-native";
import { Pressable, type PressableProps } from "react-native-gesture-handler";

export interface ButtonProps {
  loading?: boolean;
  onPress?: PressableProps["onPress"];
  disabled?: boolean;
  icon?: ReactNode;
  text?: string;
}

export default function Button({ icon, loading, text, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={props.disabled || loading}
      className="p-2 bg-blue-500 rounded-md flex flex-row"
    >
      {icon}
      <Text className="text-white text-align">{text}</Text>
      {loading && (
        <View className="absolute inset-0 flex items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
    </Pressable>
  );
}
