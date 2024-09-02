import "normalize.css";
import "./root.css";

import { API_BASE_URL } from "@config/api.ts";
import { MarathonConfigProvider } from "@config/marathon.tsx";
import { RouterProvider } from "@tanstack/react-router";
import { App as AntApp } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  cacheExchange,
  Client,
  fetchExchange,
  Provider as UrqlProvider,
} from "urql";

import { AntConfigProvider, ThemeConfigProvider } from "./config/ant.tsx";
import { router } from "./routing/router.ts";

const API_URL = `${API_BASE_URL}/graphql`;

const urqlClient = new Client({
  url: API_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const query = new URLSearchParams(window.location.search).get("masquerade");
    return {
      credentials: "include",
      headers: query
        ? {
            "x-ukdb-masquerade": query,
          }
        : undefined,
    };
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeConfigProvider>
      <AntConfigProvider>
        <AntApp style={{ height: "100%" }}>
          <UrqlProvider value={urqlClient}>
            <MarathonConfigProvider>
              <RouterProvider router={router} />
            </MarathonConfigProvider>
          </UrqlProvider>
        </AntApp>
      </AntConfigProvider>
    </ThemeConfigProvider>
  </StrictMode>
);
