import { Client, cacheExchange, fetchExchange } from "urql";

import { API_BASE_URL } from "./api";
const API_URL = `${API_BASE_URL.href}/graphql`;

export const urqlClient = new Client({
  url: API_URL,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
});
