import { DevtoolsProvider } from "@refinedev/devtools";
import { App as AntApp } from "antd";
import { StrictMode } from "react";
import { Provider as UrqlProvider } from "urql";

import { AntdThemeProvider } from "#config/ant.js";
import { urqlClient } from "#config/api.js";
import { MarathonConfigProvider } from "#config/marathon.js";
import { NivoThemeProvider } from "#config/nivo.js";

// @ts-expect-error Avoid an annoying log message from a library
window.process = { env: {} };

export function MainContext({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <AntdThemeProvider>
        <NivoThemeProvider>
          <UrqlProvider value={urqlClient}>
            <DevtoolsProvider>
              <MarathonConfigProvider>
                <AntApp style={{ height: "100%" }}>{children}</AntApp>
              </MarathonConfigProvider>
            </DevtoolsProvider>
          </UrqlProvider>
        </NivoThemeProvider>
      </AntdThemeProvider>
    </StrictMode>
  );
}
