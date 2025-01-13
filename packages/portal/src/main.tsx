import { DevtoolsProvider } from "@refinedev/devtools";
import { StrictMode } from "react";
import { Provider as UrqlProvider } from "urql";

import { AntdThemeProvider } from "#config/ant.js";
import { urqlClient } from "#config/api.js";
import { MarathonConfigProvider } from "#config/marathon.js";
import { NivoThemeProvider } from "#config/nivo.js";

if (typeof window !== "undefined") {
  // @ts-expect-error Avoid an annoying log message from a library
  window.process = { env: {} };
}

export function MainContext({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <AntdThemeProvider>
        <NivoThemeProvider>
          <UrqlProvider value={urqlClient}>
            <DevtoolsProvider>
              <MarathonConfigProvider>{children}</MarathonConfigProvider>
            </DevtoolsProvider>
          </UrqlProvider>
        </NivoThemeProvider>
      </AntdThemeProvider>
    </StrictMode>
  );
}
