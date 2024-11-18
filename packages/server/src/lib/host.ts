import type { Request } from "express";

export function getHostUrl(req: Request): URL {
  const { protocol, hostname } = req;

  return new URL(`${protocol}://${hostname}`);
}
