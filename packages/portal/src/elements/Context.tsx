import { Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { StrictMode, useState } from "react";
import { Provider as UrqlProvider } from "urql";

import watermark from "#assets/watermark.svg";
import { AntdThemeProvider } from "#config/ant.tsx";
import { urqlClient } from "#config/api.ts";
import { NivoThemeProvider } from "#config/nivo.tsx";
import { authProvider } from "#config/refine/authentication.ts";
import { accessControlProvider } from "#config/refine/authorization.ts";
import { useNotificationProvider } from "#config/refine/feedback.tsx";
import { dataProvider } from "#config/refine/graphql/data.ts";
import { refineResources } from "#config/refine/resources.tsx";
import { routerBindings } from "#config/refine/router.tsx";

export function InnerContext({ children }: { children: React.ReactNode }) {
  return (
    <Refine
      dataProvider={dataProvider}
      notificationProvider={useNotificationProvider}
      routerProvider={routerBindings}
      authProvider={authProvider}
      options={{
        projectId: "DqkUbD-wpgLRK-UO3SFV",
        title: {
          icon: <img src={watermark} alt="DanceBlue Logo" />,
          text: "DanceBlue Portal",
        },
        mutationMode: "optimistic",
        disableTelemetry: true,
        redirect: {
          afterCreate: "show",
          afterEdit: "show",
        },
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        disableServerSideValidation: true,
        liveMode: "off",
        reactQuery: {
          clientConfig: useQueryClient(),
        },
      }}
      accessControlProvider={accessControlProvider}
      resources={refineResources}
    >
      {children}
    </Refine>
  );
}

export function OuterContext({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })
  );

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AntdThemeProvider>
          <NivoThemeProvider>
            <UrqlProvider value={urqlClient}>
              <DevtoolsProvider>{children}</DevtoolsProvider>
            </UrqlProvider>
          </NivoThemeProvider>
        </AntdThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
