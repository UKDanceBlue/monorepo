import { Router } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";

const routeTree = rootRoute.addChildren([]);

export const router = new Router({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
