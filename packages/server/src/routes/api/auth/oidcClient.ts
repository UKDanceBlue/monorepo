import type { Request } from "koa";
import type { Client } from "openid-client";
import { Issuer } from "openid-client";

import { msClientId, msClientSecret, msOidcUrl } from "../../../environment.js";

export async function makeOidcClient(req: Request): Promise<Client> {
  const forwardedProto = req.get("x-forwarded-proto");
  const url = req.URL;
  url.protocol = forwardedProto || "https";

  const microsoftGateway = await Issuer.discover(msOidcUrl);
  return new microsoftGateway.Client({
    client_id: msClientId,
    client_secret: msClientSecret,
    redirect_uris: [new URL("/api/auth/oidc-callback", url).toString()],
    response_types: ["code"],
  });
}
