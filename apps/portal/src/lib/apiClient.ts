import { ApiClient } from "@ukdanceblue/db-app-common";

const dbApiClient = ApiClient.initializeInstance({
  fetch,
  Headers,
  baseUrl: new URL("http://localhost:3001/api"),
});

export default dbApiClient;
