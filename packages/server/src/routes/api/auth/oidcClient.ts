import { Container } from "@freshgum/typedi";
import { toSomeExtendedError } from "@ukdanceblue/common/error";
import { Configuration } from "openid-client";
import { discovery } from "openid-client";

import { logError } from "#lib/logging/logger.js";
import { logger } from "#lib/logging/standardLogging.js";
import {
  msClientIdToken,
  msClientSecretToken,
  msOidcUrlToken,
} from "#lib/typediTokens.js";

// TODO: Wrap this logic in a service

const msOidcUrl = Container.get(msOidcUrlToken);
const msClientId = Container.get(msClientIdToken);
const msClientSecret = Container.get(msClientSecretToken);

export let oidcConfiguration: Configuration | undefined;

const OIDC_CONFIGURATION_TTL = 10;

async function tryFetchOidcConfiguration(ttl: number, error?: unknown) {
  if (ttl <= 0) {
    logError(toSomeExtendedError(error), "Failed to fetch OIDC configuration");
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
  } else {
    try {
      oidcConfiguration = await discovery(msOidcUrl, msClientId, {
        client_id: msClientId,
        client_secret: msClientSecret,
      });
    } catch (error) {
      const waitTime = ((OIDC_CONFIGURATION_TTL - ttl) ^ 2) * 1000;
      logger.warning(
        `Failed to fetch OIDC configuration, retrying in ${waitTime}ms`,
        error
      );
      setTimeout(() => tryFetchOidcConfiguration(ttl - 1, error), waitTime);
    }
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
tryFetchOidcConfiguration(OIDC_CONFIGURATION_TTL).catch((error) => {
  logError(toSomeExtendedError(error), "Failed to fetch OIDC configuration");
});
