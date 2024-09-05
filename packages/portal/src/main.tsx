import "normalize.css";
import "./root.css";

import {
  createRouter,
  ErrorComponent,
  RouterProvider,
} from "@tanstack/react-router";
import { defaultAuthorization } from "@ukdanceblue/common";
import { Progress } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <Progress />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    auth: {
      authorization: defaultAuthorization,
      loggedIn: false,
    },
    selectedMarathon: null,
  },
  defaultPreload: false,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
