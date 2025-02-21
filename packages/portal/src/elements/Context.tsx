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
import { AntdThemeProvider } from "#config/ant.js";
import { urqlClient } from "#config/api.js";
import { NivoThemeProvider } from "#config/nivo.js";
import { authProvider } from "#config/refine/authentication.js";
import { getAccessControlProvider } from "#config/refine/authorization.js";
import { useNotificationProvider } from "#config/refine/feedback.js";
import { dataProvider } from "#config/refine/graphql/data.js";
import { refineResources } from "#config/refine/resources.js";
import { useRouterBindings } from "#config/refine/router.js";
import { useLoginState } from "#hooks/useLoginState.js";

export function InnerContext({ children }: { children: React.ReactNode }) {
  const loginState = useLoginState();
  return (
    <Refine
      dataProvider={dataProvider}
      notificationProvider={useNotificationProvider()}
      routerProvider={useRouterBindings()}
      authProvider={authProvider}
      options={{
        projectId: "DqkUbD-wpgLRK-UO3SFV",
        title: {
          icon: <img src={watermark} alt="DanceBlue Logo" />,
          text: "DanceBlue Portal",
        },
        mutationMode: "pessimistic",
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
        useNewQueryKeys: true,
      }}
      accessControlProvider={getAccessControlProvider(loginState)}
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
