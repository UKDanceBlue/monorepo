import { MarathonConfigProvider } from "@config/marathon.tsx";
import { RouterProvider } from "@tanstack/react-router";
import { App as AntApp } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as UrqlProvider } from "urql";

import { AntConfigProvider, ThemeConfigProvider } from "./config/ant.tsx";
import { urqlClient } from "./config/urql.ts";
import { router } from "./routing/router.ts";

import "normalize.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <style>
      {`
      html, body, #root {
        height: 100%;
      }
      `}
    </style>
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
