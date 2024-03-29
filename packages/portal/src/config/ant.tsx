import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";
import { useContext, useState } from "react";

import { themeConfigContext } from "./antThemeConfig";

function makeAntDesignTheme({ dark }: { dark: boolean }): ThemeConfig {
  return {
    token: {
      // Seed Token
      colorPrimary: "#0032A0",
      borderRadius: 2,

      // Alias Token
      colorBgContainer: dark ? undefined : "#f6ffed",
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

export function AntConfigProvider({ children }: { children: React.ReactNode }) {
  const { dark } = useContext(themeConfigContext);

  return (
    <ConfigProvider theme={makeAntDesignTheme({ dark })}>
      {children}
    </ConfigProvider>
  );
}
