import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange, Client, fetchExchange } from "urql";

import { SessionStorageKeys } from "#config/storage.js";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : new URL(window.location.href).origin);

export const urqlClient = new Client({
  url: `${API_BASE_URL}/graphql`,
  exchanges: [devtoolsExchange, cacheExchange, fetchExchange],
  fetchOptions: () => {
    // const query = new URLSearchParams(window.location.search).get("masquerade");
    const masquerade = sessionStorage
      .getItem(SessionStorageKeys.Masquerade)
      ?.trim();
    return {
      credentials: "include",
      headers: masquerade
        ? {
            "x-ukdb-masquerade": masquerade,
          }
        : undefined,
    };
  },
});
