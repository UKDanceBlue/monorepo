import type { Theme as ReactNavigationTheme } from "@react-navigation/native";
import { extendTheme, useColorMode, useTheme } from "native-base";

import { colors } from "./colors";
import { components } from "./components";
import {
  fontConfig,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  opacity,
  shadows,
} from "./typography";

/*
 * Useful links for extending the theme:
 * https://docs.nativebase.io/default-theme
 * https://docs.nativebase.io/dark-mode
 */
export const getCustomTheme = () =>
  extendTheme({
    colors,
    components,
    config: { initialColorMode: "light" },
    fontConfig,
    fontSizes,
    fontWeights,
    fonts,
    letterSpacings,
    lineHeights,
    opacity,
    shadows,
  } as const);

// 2. Get the type of the CustomTheme
type CustomThemeType = ReturnType<typeof getCustomTheme>;

// 3. Extend the internal NativeBase Theme
declare module "native-base" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ICustomTheme extends CustomThemeType {}
}

export const useReactNavigationTheme = (): ReactNavigationTheme => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const theme = useTheme();

  return {
    dark: isDark,
    fonts: {
      bold: {
        fontFamily: "opensans-condensed-bold",
        fontWeight: "bold",
      },
      heavy: {
        fontFamily: "opensans-condensed-bold",
        fontWeight: "700",
      },
      medium: {
        fontFamily: "opensans-condensed-bold",
        fontWeight: "500",
      },
      regular: {
        fontFamily: "opensans-condensed-bold",
        fontWeight: "normal",
      },
    },
    colors: isDark
      ? {
          primary: theme.colors.primary[300],
          background: theme.colors.gray[700],
          card: theme.colors.gray[800],
          text: theme.colors.lightText,
          border: theme.colors.gray[900],
          notification: theme.colors.primary[500],
        }
      : {
          primary: theme.colors.primary[600],
          background: theme.colors.white,
          card: theme.colors.light[100],
          text: theme.colors.darkText,
          border: theme.colors.light[400],
          notification: theme.colors.secondary[500],
        },
  };
};
