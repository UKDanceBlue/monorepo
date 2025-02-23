import { useTheme } from "@rneui/themed";
import { Appearance } from "react-native";

export function useColorModeValue<Light, Dark>(
  light: Light,
  dark: Dark,
  override?: "light" | "dark"
): Light | Dark {
  const colorScheme = override ?? useColorMode();
  switch (colorScheme) {
    case "light": {
      return light;
    }
    case "dark": {
      return dark;
    }
    default: {
      colorScheme satisfies never;
      throw new Error("Unknown color scheme");
    }
  }
}

export function useColorMode() {
  return useTheme().theme.mode;
}

export function useSetColorMode() {
  const { updateTheme } = useTheme();
  return (mode: "light" | "dark" | null) =>
    (Appearance.setColorScheme as unknown)
      ? Appearance.setColorScheme(mode)
      : updateTheme({ mode: mode ?? "light" });
}
