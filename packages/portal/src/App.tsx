import { notificationProvider } from "@refinedev/antd";
import { Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import dataProvider, { GraphQLClient } from "@refinedev/graphql";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import "@refinedev/antd/dist/reset.css";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { authProvider } from "./authProvider";
import { ColorModeContextProvider } from "./contexts/color-mode";
const API_URL = "http://localhost:4000/";
const client = new GraphQLClient(API_URL);
const gqlDataProvider = dataProvider(client);

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={gqlDataProvider}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "ToQB5v-wE0weB-H5aF9b",
              }}
            >
              <Routes>
                <Route index element={<WelcomePage />} />
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
