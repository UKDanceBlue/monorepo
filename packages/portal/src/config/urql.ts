import { API_BASE_URL } from "./api";

import { Client, cacheExchange, fetchExchange } from "urql";

const API_URL = `${API_BASE_URL}/graphql`;

export const urqlClient = new Client({
  url: API_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
});
