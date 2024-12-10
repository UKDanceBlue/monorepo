import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";

import { StorageManager, useStorageValue } from "./storage.js";

function makeAntDesignTheme({ dark }: { dark: boolean }): ThemeConfig {
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

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark] = useStorageValue(
    StorageManager.Local,
    StorageManager.keys.darkMode
  );

  return (
    <ConfigProvider theme={makeAntDesignTheme({ dark: dark === "true" })}>
      {children}
    </ConfigProvider>
  );
}
