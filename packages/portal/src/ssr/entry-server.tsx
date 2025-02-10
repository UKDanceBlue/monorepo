import { pipeline } from "node:stream/promises";

// import { extractStyle } from "@ant-design/static-style-extract";
import {
  createRequestHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";
// import { ConfigProvider } from "antd";
import type * as express from "express";

// import { makeAntDesignTheme } from "#config/makeAntDesignTheme.js";
import { createRouter } from "../router";

// const cssLight = extractStyle((node) => (
//   <ConfigProvider theme={makeAntDesignTheme({ dark: false })}>
//     {node}
//   </ConfigProvider>
// ));

// const cssDark = extractStyle((node) => (
//   <ConfigProvider theme={makeAntDesignTheme({ dark: true })}>
//     {node}
//   </ConfigProvider>
// ));

export async function render({
  req,
  res,
}: {
  req: express.Request;
  res: express.Response;
}) {
  // Convert the express request to a fetch request
  const url = new URL(req.originalUrl || req.url, "https://localhost:3000")
    .href;
  const request = new Request(url, {
    method: req.method,
    headers: (() => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        headers.set(
          key,
          value ? (Array.isArray(value) ? value.join(",") : value) : ""
        );
      }
      return headers;
    })(),
  });

  // Create a request handler
  const handler = createRequestHandler({
    request,
    createRouter: () => {
      const router = createRouter();

      // Update each router instance with the head info from vite
      router.update({
        context: {
          ...router.options.context,
        },
      });
      return router;
    },
  });

  // Let's use the default stream handler to create the response
  const response = await handler(defaultStreamHandler);

  // Convert the fetch response back to an express response
  res.statusMessage = response.statusText;
  res.status(response.status);
  response.headers.forEach((value, name) => {
    res.setHeader(name, value);
  });

  // Stream the response body
  return pipeline(response.body as unknown as NodeJS.ReadableStream, res);
}
