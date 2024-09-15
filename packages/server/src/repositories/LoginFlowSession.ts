import { PrismaClient } from "@prisma/client";
import { DateTime } from "luxon";
import { generators } from "openid-client";
import { Service } from "@freshgum/typedi";

type LoginFlowSessionUniqueParam = { id: number } | { uuid: string };

import { prismaToken } from "#prisma";

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
        codeVerifier: generators.codeVerifier(),
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
    return this.prisma.loginFlowSession.delete({ where: param });
  }
}
