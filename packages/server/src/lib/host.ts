import { Container } from "@freshgum/typedi";
import type { Request } from "express";

import { applicationPortToken } from "./typediTokens.js";

export function getHostUrl(req: Request): URL {
  const { protocol, hostname } = req;

  const applicationPort = Container.get(applicationPortToken);

  return req.get("X-Forwarded-Proto") ||
    (protocol === "https" && applicationPort === 443) ||
    (protocol === "http" && applicationPort === 80)
    ? new URL(`${protocol}://${hostname}`)
    : new URL(`${protocol}://${hostname}:${applicationPort}`);
}
