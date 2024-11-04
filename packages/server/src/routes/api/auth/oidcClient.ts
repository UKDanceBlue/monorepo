import { Container } from "@freshgum/typedi";
import type { Request } from "express";
import type { Client } from "openid-client";
import { Issuer } from "openid-client";

import {
  msClientIdToken,
  msClientSecretToken,
  msOidcUrlToken,
} from "#lib/environmentTokens.js";
import { isDevelopment } from "#lib/nodeEnv.js";

const msOidcUrl = Container.get(msOidcUrlToken);
const msClientId = Container.get(msClientIdToken);
const msClientSecret = Container.get(msClientSecretToken);

export async function makeOidcClient(req: Request): Promise<Client> {
  const forwardedProto = req.get("x-forwarded-proto");
  const url = new URL(req.originalUrl, `${req.protocol}://${req.get("host")}`);
  if (forwardedProto) {
    url.protocol = forwardedProto;
  } else if (
    isDevelopment &&
    (url.host.includes("localhost") ||
      url.host.includes("127.0.0.1") ||
      url.host.startsWith("100.10"))
  ) {
    url.protocol = "http";
  } else {
    url.protocol = "https";
  }

  const microsoftGateway = await Issuer.discover(msOidcUrl);
  return new microsoftGateway.Client({
    client_id: msClientId,
    client_secret: msClientSecret,
    redirect_uris: [new URL("/api/auth/oidc-callback", url).toString()],
    response_types: ["code"],
  });
}
