import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { App as AntApp, ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { antDesignTheme } from "./configs/ant.ts";

const API_URL = "http://localhost:4000/graphql";
const apiClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={antDesignTheme}>
      <AntApp>
        <ApolloProvider client={apiClient}>
          <App />
        </ApolloProvider>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
