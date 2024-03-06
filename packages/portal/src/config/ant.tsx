import type { ThemeConfig } from "antd";
import { ConfigProvider, theme } from "antd";
import { useEffect, useState } from "react";

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

export function AntConfigProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    darkModePreference.addEventListener("change", (e) => {
      setDark(e.matches);
    });
    setDark(darkModePreference.matches);
  }, []);

  return (
    <ConfigProvider theme={makeAntDesignTheme({ dark })}>
      {children}
    </ConfigProvider>
  );
}
