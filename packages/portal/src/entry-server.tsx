if (import.meta.env.SSR) {
  throw new Error("This file should only be imported on the client side.");
}

import { createMemoryHistory } from "@tanstack/react-router";
import ReactDOMServer from "react-dom/server";
import { router } from "router";

export async function render(url: string) {
  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  });

  // @ts-expect-error - We don't need to pass a context
  router.update({
    history: memoryHistory,
  });

  await router.load();

  const { default: Main } = await import("./main");

  const appHtml = ReactDOMServer.renderToString(<Main />);

  return appHtml;
}
