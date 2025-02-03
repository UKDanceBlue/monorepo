import { devtoolsExchange } from "@urql/devtools";
import { Client, fetchExchange } from "urql";

import { StorageManager } from "./storage";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : new URL(window.location.href).origin);

export const urqlClient = new Client({
  url: `${API_BASE_URL}/graphql`,
  exchanges: [devtoolsExchange, fetchExchange],
  fetchOptions: () => {
    // const query = new URLSearchParams(window.location.search).get("masquerade");
    const masquerade = StorageManager.Local.get(StorageManager.keys.masquerade);
    return {
      credentials: "include",
      headers: masquerade
        ? {
            "x-ukdb-masquerade": masquerade,
          }
        : undefined,
    };
  },
  fetch: async (input, init) => {
    const response = await fetch(input, init);
    if (response.status === 500) {
      let message;
      try {
        const json = (await response.clone().json()) as unknown;
        if (json && typeof json === "object" && "message" in json) {
          message = String(json.message);
        }
      } catch {
        const text = await response.clone().text();
        message = text.substring(0, 1000);
      }
      throw new Error(`Server error: ${message}`);
    }
    return response;
  },
});
