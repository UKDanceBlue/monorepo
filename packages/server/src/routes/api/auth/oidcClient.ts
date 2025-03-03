import { Service } from "@freshgum/typedi";
import { Duration } from "luxon";
import { Configuration } from "openid-client";
import { discovery } from "openid-client";

import { CachedValue } from "#lib/CachedValue.js";
import {
  msClientIdToken,
  msClientSecretToken,
  msOidcUrlToken,
} from "#lib/typediTokens.js";

@Service([msOidcUrlToken, msClientIdToken, msClientSecretToken])
export class OidcClient {
  constructor(
    private readonly msOidcUrl: URL,
    private readonly msClientId: string,
    private readonly msClientSecret: string
  ) {}

  private oidcConfiguration = new CachedValue<Configuration>(
    this.fetchOidcConfiguration.bind(this),
    Duration.fromObject({ days: 10 }),
    {
      debugName: "OIDC Configuration",
    }
  );

  async getOidcConfiguration(): Promise<Configuration> {
    return this.oidcConfiguration.get();
  }

  async fetchOidcConfiguration(): Promise<Configuration> {
    return discovery(this.msOidcUrl, this.msClientId, {
      client_id: this.msClientId,
      client_secret: this.msClientSecret,
    });
  }
}
