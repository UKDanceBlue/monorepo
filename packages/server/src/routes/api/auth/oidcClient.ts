import { Container } from "@freshgum/typedi";
import { discovery } from "openid-client";

import {
  msClientIdToken,
  msClientSecretToken,
  msOidcUrlToken,
} from "@/lib/environmentTokens.js";

const msOidcUrl = Container.get(msOidcUrlToken);
const msClientId = Container.get(msClientIdToken);
const msClientSecret = Container.get(msClientSecretToken);

export const oidcConfiguration = await discovery(msOidcUrl, msClientId, {
  client_id: msClientId,
  client_secret: msClientSecret,
  response_types: ["code"],
});
