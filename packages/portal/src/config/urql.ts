import { Client, cacheExchange, fetchExchange } from "urql";
const API_URL = "http://localhost:4000/graphql";

export const urqlClient = new Client({
  url: API_URL,
  exchanges: [cacheExchange, fetchExchange],
});
