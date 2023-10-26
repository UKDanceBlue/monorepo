import { RouterProvider } from "@tanstack/react-router";
import { App as AntApp, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as UrqlProvider } from "urql";

import { antDesignTheme } from "./config/ant.ts";
import { urqlClient } from "./config/urql.ts";
import { router } from "./routing/router.ts";

import "normalize.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={antDesignTheme}>
      <AntApp>
        <UrqlProvider value={urqlClient}>
          <RouterProvider router={router} />
        </UrqlProvider>
      </AntApp>
    </ConfigProvider>
  </StrictMode>
);
