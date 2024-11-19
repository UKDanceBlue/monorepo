import { Service } from "@freshgum/typedi";
import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { randomPKCECodeVerifier } from "openid-client";

type LoginFlowSessionUniqueParam = { id: number } | { uuid: string };

import { prismaToken } from "#lib/typediTokens.js";

@Service([prismaToken])
export class LoginFlowSessionRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders

  /**
   * Find a login flow session by its unique identifier
   */
  findLoginFlowSessionByUnique(param: LoginFlowSessionUniqueParam) {
    return this.prisma.loginFlowSession.findUnique({ where: param });
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
    return this.prisma.loginFlowSession.create({
      data: {
        redirectToAfterLogin,
        setCookie,
        sendToken,
        codeVerifier: randomPKCECodeVerifier(),
      },
    });
  }

  /**
   * Remove all login flows older than 24 hours
   */
  gcOldLoginFlows() {
    return this.prisma.loginFlowSession.deleteMany({
      where: {
        createdAt: {
          lte: DateTime.now().minus({ days: 1 }).toJSDate(),
        },
      },
    });
  }

  /**
   * Complete a login flow by deleting it
   */
  async completeLoginFlow(param: LoginFlowSessionUniqueParam) {
    // Using deleteMany instead of delete means we don't throw an error if the session was already deleted
    return this.prisma.loginFlowSession.deleteMany({ where: param });
  }
}
