import { Container } from "@freshgum/typedi";
import { Configuration } from "openid-client";
import { discovery } from "openid-client";

import { logger } from "#lib/logging/standardLogging.js";
import {
  msClientIdToken,
  msClientSecretToken,
  msOidcUrlToken,
} from "#lib/typediTokens.js";

const msOidcUrl = Container.get(msOidcUrlToken);
const msClientId = Container.get(msClientIdToken);
const msClientSecret = Container.get(msClientSecretToken);

export let oidcConfiguration: Configuration;

try {
  oidcConfiguration = await discovery(msOidcUrl, msClientId, {
    client_id: msClientId,
    client_secret: msClientSecret,
  });
} catch (error) {
  logger.error(
    "Failed to fetch OIDC configuration, using possibly invalid local configuration",
    error
  );
  oidcConfiguration = new Configuration(
    {
      issuer: msOidcUrl.href,
      response_types_supported: ["code"],
    },
    msClientId,
    {
      client_id: msClientId,
      client_secret: msClientSecret,
    }
  );
}
