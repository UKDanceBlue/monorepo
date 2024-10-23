import { createRoot } from "react-dom/client";

import Main from "./main";

if (import.meta.env.SSR) {
  throw new Error("This file should only be imported on the client side.");
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<Main />);
}
