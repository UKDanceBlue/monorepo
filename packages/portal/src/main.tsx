import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const API_URL = "http://localhost:4000/graphql";
const apiClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apiClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
