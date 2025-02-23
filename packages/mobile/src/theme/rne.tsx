import { createTheme, ThemeProvider } from "@rneui/themed";
import type { ReactNode } from "react";

import { colors } from "./colors";

const theme = createTheme({
  lightColors: {
    primary: colors.primary[600],
    secondary: colors.secondary[400],
    error: colors.red[500],
    warning: colors.orange[500],
    success: colors.green[700],
    black: colors.dark[900],
    white: colors.light[50],
    grey0: colors.gray[800],
    grey1: colors.gray[700],
    grey2: colors.gray[600],
    grey3: colors.gray[500],
    grey4: colors.gray[300],
    grey5: colors.gray[200],
    greyOutline: colors.gray[400],
    disabled: colors.light[900],
    background: colors.gray[100],
    divider: colors.gray[200],
    searchBg: colors.gray[100],
  },
  darkColors: {
    primary: colors.primary[600],
    secondary: colors.secondary[400],
    error: colors.red[500],
    warning: colors.orange[500],
    success: colors.green[700],
    black: colors.dark[900],
    white: colors.light[50],
    grey0: colors.gray[200],
    grey1: colors.gray[300],
    grey2: colors.gray[500],
    grey3: colors.gray[600],
    grey4: colors.gray[700],
    grey5: colors.gray[800],
    greyOutline: colors.gray[400],
    disabled: colors.dark[600],
    background: colors.gray[900],
    divider: colors.gray[800],
    searchBg: colors.gray[900],
  },
});

export function RneThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
