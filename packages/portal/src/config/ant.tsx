import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";
import { createContext, useContext, useState } from "react";

export const themeConfigContext = createContext<{
  dark: boolean;
  setDark: (dark: boolean) => void;
}>({
  dark: false,
  setDark: () => {},
});

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
  const [dark, setDark] = useState(false);

  return (
    <themeConfigContext.Provider value={{ dark, setDark }}>
      <ConfigProvider theme={makeAntDesignTheme({ dark })}>
        {children}
      </ConfigProvider>
    </themeConfigContext.Provider>
  );
}

export function AntConfigProvider({ children }: { children: React.ReactNode }) {
  const dark = useContext(themeConfigContext).dark;

  return (
    <ConfigProvider theme={makeAntDesignTheme({ dark })}>
      {children}
    </ConfigProvider>
  );
}
