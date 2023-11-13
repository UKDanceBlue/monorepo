import { RouterProvider } from "@tanstack/react-router";
import { App as AntApp } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as UrqlProvider } from "urql";

import { AntConfigProvider } from "./config/ant.tsx";
import { urqlClient } from "./config/urql.ts";
import { router } from "./routing/router.ts";

import "normalize.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AntConfigProvider>
      <AntApp>
        <UrqlProvider value={urqlClient}>
          <RouterProvider router={router} />
        </UrqlProvider>
      </AntApp>
    </AntConfigProvider>
  </StrictMode>
);
