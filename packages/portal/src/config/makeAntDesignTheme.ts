import { theme, type ThemeConfig } from "antd";

export function makeAntDesignTheme({ dark }: { dark: boolean }): ThemeConfig {
  return {
    token: {
      colorPrimary: "#0032a0",
      colorSuccess: "#ffc72c",
      colorWarning: "#fa8c16",
      colorBgBase: dark ? "#000810" : "#f4fcff",
      colorTextBase: dark ? "#f4fcff" : "#000810",
      borderRadius: 4,
    },
    algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };
}
