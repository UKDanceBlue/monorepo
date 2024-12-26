import { Service } from "@freshgum/typedi";
import { DateTime } from "luxon";
import { randomPKCECodeVerifier } from "openid-client";

type LoginFlowSessionUniqueParam = { id: number } | { uuid: string };

import { eq, lte } from "drizzle-orm";

import type { Drizzle } from "#db";
import { drizzleToken } from "#lib/typediTokens.js";
import { loginFlowSession } from "#schema/tables/misc.sql.js";

@Service([drizzleToken])
export class LoginFlowSessionRepository {
  constructor(protected readonly db: Drizzle) {}

  // Finders

  /**
   * Find a login flow session by its unique identifier
   */
  findLoginFlowSessionByUnique(param: LoginFlowSessionUniqueParam) {
    // return this.prisma.loginFlowSession.findUnique({ where: param });
    return this.db.query.loginFlowSession.findFirst({
      where:
        "id" in param
          ? eq(loginFlowSession.id, param.id)
          : eq(loginFlowSession.uuid, param.uuid),
    });
  }

  // Mutators

  /**
   * Start a new login flow, generating a new code verifier
   */
  startLoginFlow({
    redirectToAfterLogin,
    sendToken,
    setCookie,
  }: {
    redirectToAfterLogin: string;
    setCookie?: boolean;
    sendToken?: boolean;
  }) {
    return this.db
      .insert(loginFlowSession)
      .values({
        redirectToAfterLogin,
        setCookie,
        sendToken,
        codeVerifier: randomPKCECodeVerifier(),
      })
      .returning()
      .execute();
  }

  /**
   * Remove all login flows older than 24 hours
   */
  gcOldLoginFlows() {
    return this.db
      .delete(loginFlowSession)
      .where(lte(loginFlowSession.createdAt, DateTime.now().minus({ days: 1 })))
      .returning()
      .execute();
  }

  /**
   * Complete a login flow by deleting it
   */
  completeLoginFlow(param: LoginFlowSessionUniqueParam) {
    return this.db
      .delete(loginFlowSession)
      .where(
        "id" in param
          ? eq(loginFlowSession.id, param.id)
          : eq(loginFlowSession.uuid, param.uuid)
      )
      .returning()
      .execute();
  }
}
