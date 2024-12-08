import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";
import { useState } from "react";

import { themeConfigContext } from "./antThemeConfig.js";

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

export function ThemeConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(document.cookie.includes("dark=true"));

  const setDarkAndCookie = (dark: boolean) => {
    setDark(dark);
    document.cookie = `dark=${dark}; path=/; max-age=31536000`;
  };

  return (
    <themeConfigContext.Provider value={{ dark, setDark: setDarkAndCookie }}>
      <ConfigProvider theme={makeAntDesignTheme({ dark })}>
        {children}
      </ConfigProvider>
    </themeConfigContext.Provider>
  );
}
