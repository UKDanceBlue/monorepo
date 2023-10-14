import { ApolloProvider } from "@apollo/client";
import { RouterProvider } from "@tanstack/react-router";
import { App as AntApp, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { antDesignTheme } from "./config/ant.ts";
import { apolloClient } from "./config/apollo.ts";
import { router } from "./routing/router.ts";

import "normalize.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={antDesignTheme}>
      <AntApp>
        <ApolloProvider client={apolloClient}>
          <RouterProvider router={router} />
        </ApolloProvider>
      </AntApp>
    </ConfigProvider>
  </StrictMode>
);
