import { ApolloProvider } from "@apollo/client";
import { App as AntApp, ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { antDesignTheme } from "./configs/ant.ts";
import { apolloClient } from "./configs/apollo.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={antDesignTheme}>
      <AntApp>
        <ApolloProvider client={apolloClient}>
          <App />
        </ApolloProvider>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
