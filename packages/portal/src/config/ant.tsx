import { ConfigProvider } from "antd";

import { makeAntDesignTheme } from "./makeAntDesignTheme.js";
import { StorageManager, useStorageValue } from "./storage.js";

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
