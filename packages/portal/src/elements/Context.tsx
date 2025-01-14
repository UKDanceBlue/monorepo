import { DevtoolsProvider } from "@refinedev/devtools";
import { StrictMode } from "react";
import { Provider as UrqlProvider } from "urql";

import { AntdThemeProvider } from "#config/ant.tsx";
import { urqlClient } from "#config/api.ts";
import { MarathonConfigProvider } from "#config/marathon.tsx";
import { NivoThemeProvider } from "#config/nivo.tsx";

export function InnerContext({ children }: { children: React.ReactNode }) {
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

export function OuterContext({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
