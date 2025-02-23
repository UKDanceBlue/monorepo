import { useColorScheme } from "react-native";

const DEFAULT_COLOR_SCHEME = "light";

export function useColorModeValue<Light, Dark>(
  light: Light,
  dark: Dark,
  override?: "light" | "dark"
): Light | Dark {
  const colorScheme = override ?? useColorScheme() ?? DEFAULT_COLOR_SCHEME;
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

export function useColors(override?: "light" | "dark") {
  return {
    action: colors.primary[400],
    danger: useColorModeValue(colors.red[400], colors.red[500], override),
    negative: colors.red[300],
    positive: colors.green[600],
    success: colors.green[700],
    error: colors.red[500],
    textLight: useColorModeValue(colors.dark[600], colors.light[900], override),
    text: useColorModeValue(colors.dark[700], colors.light[500], override),
    textDark: useColorModeValue(colors.dark[800], colors.light[100], override),
    backgroundLow: useColorModeValue(
      colors.gray[50],
      colors.gray[900],
      override
    ),
    background: useColorModeValue(colors.gray[100], colors.gray[800], override),
    backgroundHigh: useColorModeValue(
      colors.gray[200],
      colors.gray[600],
      override
    ),
    white: colors.light[50],
    black: colors.dark[900],
  } as const;
}

export const colors = {
  primary: {
    // BASE COLOR: #0032A0 (level 600), Dark Blue
    50: "#e0edff",
    100: "#BBC9E8",
    200: "#7fa7ff",
    300: "#4d84ff",
    400: "#1e61fe",
    500: "#0748e5",
    600: "#0032A0",
    700: "#002881",
    800: "#001850",
    900: "#000820",
  },
  secondary: {
    // SECONDARY COLOR: #FFC72C (level 400), Gold
    50: "#fff8da",
    100: "#ffebad",
    200: "#ffdd7d",
    300: "#ffd04b",
    400: "#FFC72C",
    500: "#e6a900",
    600: "#b38300",
    700: "#805e00",
    800: "#4e3800",
    900: "#1d1300",
  },
  red: {
    50: "#ffe1e1",
    100: "#ffb1b1",
    200: "#ff7f7f",
    300: "#ff4c4c",
    400: "#ff1a1a",
    500: "#e60000",
    600: "#b40000",
    700: "#810000",
    800: "#500000",
    900: "#210000",
  },
  orange: {
    50: "#fff2db",
    100: "#ffdbaf",
    200: "#fdc57f",
    300: "#fcae4f",
    400: "#fa971e",
    500: "#e17d05",
    600: "#af6101",
    700: "#7e4500",
    800: "#4d2900",
    900: "#1e0c00",
  },
  yellow: {
    50: "#fffbda",
    100: "#fff4ad",
    200: "#ffec7d",
    300: "#ffe54b",
    400: "#ffdd1a",
    500: "#e6c400",
    600: "#b39800",
    700: "#806d00",
    800: "#4d4100",
    900: "#1c1600",
  },
  green: {
    50: "#dfffed",
    100: "#b2fed2",
    200: "#83fcb6",
    300: "#54fa9a",
    400: "#2bf97e",
    500: "#19df64",
    600: "#0eae4e",
    700: "#037c37",
    800: "#004a20",
    900: "#001a06",
  },
  blue: {
    50: "#dcf5ff",
    100: "#aeddff",
    200: "#7ec5ff",
    300: "#4daefd",
    400: "#1e97fb",
    500: "#047de1",
    600: "#0061b0",
    700: "#00457f",
    800: "#002a4f",
    900: "#000f20",
  },
  purple: {
    50: "#f2eaff",
    100: "#d3c5ef",
    200: "#b4a1e0",
    300: "#967bd1",
    400: "#7855c3",
    500: "#5f3caa",
    600: "#4a2f85",
    700: "#352060",
    800: "#20133c",
    900: "#0d051a",
  },
  gray: {
    50: "#e8f3ff",
    100: "#cfd8e3",
    200: "#b5bdcc",
    300: "#97a3b4",
    400: "#7b899d",
    500: "#626f84",
    600: "#4b5768",
    700: "#343e4b",
    800: "#1e2530",
    900: "#070c18",
  },
  light: {
    50: "#ffffff",
    100: "#f9f9f9",
    200: "#f3f3f3",
    300: "#ececec",
    400: "#e5e5e5",
    500: "#dedede",
    600: "#d6d6d6",
    700: "#cecece",
    800: "#c5c5c5",
    900: "#b9b9b9",
  },
  dark: {
    50: "#8f8f8f",
    100: "#7f7f7f",
    200: "#6f6f6f",
    300: "#5f5f5f",
    400: "#4f4f4f",
    500: "#3f3f3f",
    600: "#2d2d2d",
    700: "#1c1c1c",
    800: "#101010",
    900: "#000000",
  },
} as const;
