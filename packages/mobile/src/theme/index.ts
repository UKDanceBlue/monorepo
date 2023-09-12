import { Theme as ReactNavigationTheme } from "@react-navigation/native";
import { extendTheme, useColorMode, useTheme } from "native-base";
import { useMemo } from "react";

import { colors } from "./colors";
import { components } from "./components";
import { fontConfig, fontSizes, fontWeights, fonts, letterSpacings, lineHeights, opacity, shadows } from "./typography";

/*
 * Useful links for extending the theme:
 * https://docs.nativebase.io/default-theme
 * https://docs.nativebase.io/dark-mode
 */
export const getCustomTheme = () => extendTheme({
  colors,
  components,
  config: { "initialColorMode": "light" },
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
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ICustomTheme extends CustomThemeType {}
}

export const useReactNavigationTheme = (): ReactNavigationTheme => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const theme = useTheme();

  return useMemo(() => {
    if (isDark) {
      return {
        dark: true,
        colors: {
          primary: theme.colors.primary[300],
          secondary: theme.colors.secondary[400],
          tertiary: theme.colors.tertiary[500],
          background: theme.colors.gray[700],
          card: theme.colors.gray[800],
          text: theme.colors.lightText,
          border: theme.colors.gray[900],
          notification: theme.colors.primary[500],
        },
      };
    } else {
      return {
        dark: false,
        colors: {
          primary: theme.colors.primary[600],
          secondary: theme.colors.secondary[400],
          tertiary: theme.colors.tertiary[500],
          background: theme.colors.white,
          card: theme.colors.light[100],
          text: theme.colors.darkText,
          border: theme.colors.light[400],
          notification: theme.colors.secondary[500],
        },
      };
    }
  }, [ isDark, theme ]);
};
